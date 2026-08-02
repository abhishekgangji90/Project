from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    preferred_language: str
    
    class Config:
        populate_by_name = True

class UserLanguageUpdate(BaseModel):
    preferred_language: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
