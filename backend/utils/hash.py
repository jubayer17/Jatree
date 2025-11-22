# utils/hash.py
from passlib.context import CryptContext
import sys

print("[utils.hash] loading Argon2 password utils", file=sys.stderr)

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    if password is None:
        password = ""
    if not isinstance(password, str):
        password = str(password)
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    if password is None:
        password = ""
    if not isinstance(password, str):
        password = str(password)
    return pwd_context.verify(password, hashed)
