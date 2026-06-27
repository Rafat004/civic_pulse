import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

async def main():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR;"))
            print("Successfully added hashed_password column.")
        except Exception as e:
            print(f"Error (might already exist): {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
