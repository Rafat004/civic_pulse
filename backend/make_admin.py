import asyncio
import sys
import os

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from sqlalchemy.future import select

async def promote_user(email: str):
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user:
            print(f"User with email {email} not found!")
            return
            
        user.role = "admin"
        await db.commit()
        print(f"Success! {user.name} ({user.email}) is now an Admin.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <your_google_email>")
        sys.exit(1)
        
    asyncio.run(promote_user(sys.argv[1]))
