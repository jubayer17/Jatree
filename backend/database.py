from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import sys


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

MONGO_URL = os.getenv("MONGO_URL")
print("[database] Loaded MONGO_URL:", MONGO_URL, file=sys.stderr)

if not MONGO_URL:
    raise RuntimeError("MONGO_URL not set in .env")

print("[database] connecting to MongoDB ...", file=sys.stderr)
client = AsyncIOMotorClient(MONGO_URL)
db = client["shohoj_ticket"]
users_collection = db["users"]
