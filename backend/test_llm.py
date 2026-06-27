import asyncio
from app.services.llm_service import extract_complaint_details
import sys

async def main():
    text = "MASSIVE EMERGENCY! A huge sinkhole just completely collapsed the center lane on the highway bridge. An exposed, sparking live electrical wire is dangling directly over the remaining lane, and a water main has burst causing a major flood. This is extremely life-threatening and cars are going to crash. You need to dispatch emergency crews immediately right now to shut down the road!"
    
    print("Testing extraction...")
    details = await extract_complaint_details(text)
    print(f"Result: {details}")

if __name__ == "__main__":
    asyncio.run(main())
