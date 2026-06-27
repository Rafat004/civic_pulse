import os
from fastapi import UploadFile
import uuid

async def upload_evidence(file: UploadFile) -> str:
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
        
    return f"/static/uploads/{filename}"
