import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DB_URL = "postgresql+asyncpg://neondb_owner:npg_5WXwTnHjVM0I@ep-dark-sunset-at77ag4c.c-9.us-east-1.aws.neon.tech/neondb?ssl=require"

async def main():
    engine = create_async_engine(DB_URL)
    async with engine.connect() as conn:
        try:
            res = await conn.scalar(text("SELECT version_num FROM alembic_version"))
            print("Alembic version:", res)
        except Exception as e:
            print("Error:", e)

asyncio.run(main())
