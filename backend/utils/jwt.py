from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
ALGORITHM = "HS256"

def create_token(data: dict, days: int = 7) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(days=days)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
