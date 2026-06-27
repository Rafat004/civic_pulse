from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from geoalchemy2.elements import WKTElement
from app.db.session import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintResponse, ComplaintUpdate
from app.services.llm_service import extract_complaint_details, generate_justification, get_embedding
from app.services.scoring_service import calculate_priority_score
from app.services.storage_service import upload_evidence
from app.core.security import get_optional_current_user, get_current_active_admin
from app.models.user import User
from app.models.score_override import ScoreOverride
from app.schemas.score_override import ScoreOverrideCreate, ScoreOverrideResponse

router = APIRouter()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    description: str = Form(...),
    category: str = Form("other"),
    lat: float = Form(...),
    lng: float = Form(...),
    photo: UploadFile = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user)
):
    # 1. Upload photo if exists
    photo_url = None
    evidence_score = 0.5
    if photo and photo.filename:
        photo_url = await upload_evidence(photo)
        evidence_score = 1.0
        
    # 2. Extract details via LLM
    details = await extract_complaint_details(description, category)
    severity = details.get("severity", 3)
    urgency = details.get("urgency", 3)
    
    # 3. Duplicate check & Embedding
    embedding = await get_embedding(description)
    
    # 4. Rule-based score
    recurrence_count = 0
    score = calculate_priority_score(
        severity=severity,
        urgency=urgency,
        evidence_score=evidence_score,
        recurrence_count=recurrence_count
    )
    
    # 5. Justification via LLM
    ai_justification = await generate_justification(description, score, details)
    
    # 6. Save to DB
    point = f"POINT({lng} {lat})"
    
    new_complaint = Complaint(
        citizen_id=current_user.id if current_user else None,
        description=description,
        category=category,
        severity=severity,
        urgency=urgency,
        evidence_score=evidence_score,
        recurrence_count=recurrence_count,
        geom=WKTElement(point, srid=4326),
        embedding=embedding,
        photo_url=photo_url,
        score=score,
        ai_justification=ai_justification
    )
    
    db.add(new_complaint)
    await db.commit()
    await db.refresh(new_complaint)
    
    return new_complaint

@router.get("/", response_model=list[ComplaintResponse])
async def get_complaints(own: bool = False, db: AsyncSession = Depends(get_db), current_user: User | None = Depends(get_optional_current_user)):
    query = select(Complaint).order_by(Complaint.created_at.desc())
    if own:
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        query = query.where(Complaint.citizen_id == current_user.id)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: int, 
    complaint_update: ComplaintUpdate,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_active_admin)
):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = complaint_update.status
    await db.commit()
    await db.refresh(complaint)
    return complaint

@router.post("/{complaint_id}/override", response_model=ScoreOverrideResponse)
async def create_score_override(
    complaint_id: int,
    override_data: ScoreOverrideCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    old_score = complaint.score
    complaint.score = override_data.new_score
    
    override = ScoreOverride(
        complaint_id=complaint_id,
        admin_id=current_user.id,
        old_score=old_score,
        new_score=override_data.new_score,
        reason=override_data.reason
    )
    db.add(override)
    await db.commit()
    await db.refresh(override)
    
    # We need to return it with the extra info for the schema if needed,
    # but the frontend might just reload the list, so basic response is fine.
    return override


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Total complaints
    result = await db.execute(select(func.count(Complaint.id)))
    total_complaints = result.scalar() or 0
    
    # Complaints by status
    result = await db.execute(select(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status))
    status_counts_db = result.all()
    status_counts = {status: count for status, count in status_counts_db}
    
    # Complaints by category
    result = await db.execute(select(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category))
    category_counts_db = result.all()
    category_counts = {cat: count for cat, count in category_counts_db}
    
    # Compute aggregates
    resolved = status_counts.get("resolved", 0)
    rejected = status_counts.get("rejected", 0)
    
    # Pending is anything that is not resolved or rejected
    pending = total_complaints - resolved - rejected
    
    # Find critical issues (severity >= 4, active)
    result = await db.execute(
        select(func.count(Complaint.id))
        .where(Complaint.severity >= 4)
        .where(Complaint.status.notin_(["resolved", "rejected"]))
    )
    critical = result.scalar() or 0
    
    # Basic Health Score calculation (0-100)
    score = 100
    if total_complaints > 0:
        # Subtract points for high pending ratio (up to 40 points)
        pending_ratio = pending / total_complaints
        score -= int(pending_ratio * 40)
        
        # Subtract points for high critical ratio (up to 60 points)
        critical_ratio = critical / total_complaints
        score -= int(critical_ratio * 120)  # Heavy penalty for critical
        
    return {
        "total": total_complaints,
        "active": pending,
        "health_score": max(0, min(100, score)),
        "by_status": status_counts,
        "by_category": category_counts,
        "critical": critical,
        "resolved": resolved,
        "pending": pending - critical # Subtract critical from pending so they are mutually exclusive in UI
    }
