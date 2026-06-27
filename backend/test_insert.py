import asyncio
from app.db.session import AsyncSessionLocal
from app.models.complaint import Complaint
from geoalchemy2.elements import WKTElement

async def main():
    async with AsyncSessionLocal() as db:
        c = Complaint(
            description="test",
            category="test",
            severity=1,
            urgency=1,
            evidence_score=1.0,
            recurrence_count=0,
            geom=WKTElement("POINT(-87.6298 41.8781)", srid=4326),
            embedding=[0.0]*768,
        )
        db.add(c)
        await db.commit()
        await db.refresh(c)
        print(f"Type of geom: {type(c.geom)}")
        print(f"lat: {c.lat}, lng: {c.lng}")

if __name__ == "__main__":
    asyncio.run(main())
