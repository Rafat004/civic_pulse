import asyncio
from app.db.session import AsyncSessionLocal
from app.models.complaint import Complaint
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Complaint))
        comps = res.scalars().all()
        for c in comps:
            print(f"Complaint {c.id}: lat={c.lat}, lng={c.lng}")

if __name__ == "__main__":
    asyncio.run(main())
