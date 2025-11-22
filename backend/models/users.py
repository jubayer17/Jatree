from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=4, max_length=1024)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
