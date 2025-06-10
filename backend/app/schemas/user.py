from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from enum import Enum
from app.core.database import PydanticObjectId
from app.schemas.base import MongoBaseModel, UpdateBaseModel

class UserRole(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    USER = "user"

class UserBase(BaseModel):
    """Base user schema with common attributes"""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = Field(default=UserRole.USER)

class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v

class UserUpdate(UpdateBaseModel):
    """Schema for user updates"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    is_active: Optional[bool] = None

class UserInDB(UserBase, MongoBaseModel):
    """Schema for user as stored in database"""
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True
    }

class UserResponse(UserBase, MongoBaseModel):
    """Schema for user responses (without sensitive data)"""
    pass

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)

class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """Schema for token payload"""
    sub: Optional[str] = None

class User(UserBase):
    id: PydanticObjectId = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    } 