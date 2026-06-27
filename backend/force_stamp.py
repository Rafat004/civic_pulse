import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DB_URL = "postgresql+asyncpg://neondb_owner:npg_5WXwTnHjVM0I@ep-dark-sunset-at77ag4c.c-9.us-east-1.aws.neon.tech/neondb?ssl=require"

async def main():
    engine = create_async_engine(DB_URL)
    async with engine.begin() as conn:
        try:
            print("Creating alembic_version...")
            await conn.execute(text("CREATE TABLE alembic_version (version_num VARCHAR(32) PRIMARY KEY);"))
            await conn.execute(text("INSERT INTO alembic_version (version_num) VALUES ('573fa57d3e09');"))
            print("Stamp successful.")
        except Exception as e:
            print("Error:", e)

asyncio.run(main())
