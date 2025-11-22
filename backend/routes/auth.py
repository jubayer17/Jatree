# backend/routes/auth.py
from typing import Optional
from fastapi import APIRouter, HTTPException, Response, Request, Depends, status, Header
from pydantic import BaseModel
from jose import jwt, JWTError
import os
import logging

from backend.models.users import UserCreate, UserLogin
from backend.utils.hash import hash_password, verify_password
from backend.utils.jwt import create_token, SECRET_KEY, ALGORITHM
from backend.database import users_collection

router = APIRouter(tags=["Authentications"])
logger = logging.getLogger("uvicorn.error")

# Cookie settings (dev-friendly defaults)
ACCESS_TOKEN_EXPIRE_DAYS = 1
ACCESS_TOKEN_NAME = os.getenv("ACCESS_TOKEN_NAME", "access_token")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() in ("true", "1", "yes")
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")  # 'lax' on dev, 'none' in some cross-site setups (with secure=True)
COOKIE_HTTPONLY = True
COOKIE_PATH = "/"


# Minimal user response model (returned to client)
class UserOut(BaseModel):
    name: str
    email: str


# ----------------------
# SIGNUP
# ----------------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed = hash_password(user.password)
    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed
    })

    return {"message": "Signup successful"}


# ----------------------
# LOGIN
# ----------------------
@router.post("/login")
async def login(user: UserLogin, response: Response):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password")

    # Create JWT token (expires in ACCESS_TOKEN_EXPIRE_DAYS)
    token_payload = {"sub": db_user["email"]}
    token = create_token(token_payload, days=ACCESS_TOKEN_EXPIRE_DAYS)

    # Set httpOnly cookie for browser clients
    max_age = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    response.set_cookie(
        key=ACCESS_TOKEN_NAME,
        value=token,
        httponly=COOKIE_HTTPONLY,
        secure=COOKIE_SECURE,   # must be False for http://localhost dev
        samesite=COOKIE_SAMESITE,
        max_age=max_age,
        path=COOKIE_PATH,
    )

    # Also return token & user in JSON for Postman / mobile / debugging clients
    return {
        "message": "Login successful",
        "token": token,
        "user": {"name": db_user.get("name"), "email": db_user.get("email")}
    }


# ----------------------
# LOGOUT
# ----------------------
@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key=ACCESS_TOKEN_NAME, path=COOKIE_PATH)
    return {"message": "Logout successful"}


# ----------------------
# Dependency: get_current_user
# Accepts token from either Authorization header or cookie
# ----------------------
async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(default=None)  # reads "Authorization" header
) -> UserOut:
    token = None

    # 1) try Authorization header first (Bearer <token>)
    if authorization:
        auth = authorization.strip()
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
        else:
            token = auth  # allow raw token as header for convenience

    # 2) fallback to cookie named ACCESS_TOKEN_NAME
    if not token:
        token = request.cookies.get(ACCESS_TOKEN_NAME)

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except JWTError as e:
        logger.info("JWT decode error: %s", e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    db_user = await users_collection.find_one({"email": email}, {"password": 0})
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return UserOut(name=db_user.get("name"), email=db_user.get("email"))


# ----------------------
# Protected route
# ----------------------
@router.get("/me", response_model=UserOut)
async def me(user: UserOut = Depends(get_current_user)):
    return user
