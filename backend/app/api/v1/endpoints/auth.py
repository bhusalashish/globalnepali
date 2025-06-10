from datetime import datetime, timedelta
from typing import Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.database import get_collection_item, create_collection_item, get_database, get_collection
from app.core.security import security
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
from bson import ObjectId

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: EmailStr
    full_name: str
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginData(BaseModel):
    email: EmailStr
    password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> UserResponse:
    """
    Get the current authenticated user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = security.decode_token(token)
        if payload is None:
            raise credentials_exception
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    users_collection = await get_collection("users")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if user is None:
        raise credentials_exception
        
    return user

async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Get the current active user.
    """
    if not current_user["is_active"]:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    """
    Authenticate a user with email and password.
    Returns the user if authentication is successful, None otherwise.
    """
    users_collection = await get_collection("users")
    user = await users_collection.find_one({"email": email})
    
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user["_id"])}
    )
    
    # Convert ObjectId to string for JSON serialization
    user_data = dict(user)
    user_data["_id"] = str(user_data["_id"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/register", response_model=User)
async def register(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user with email already exists
    existing_user = await get_collection_item(
        collection=db.users,
        query={"email": user.email}
    )
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data.update({
        "hashed_password": hashed_password,
        "role": "user",  # Default role
        "is_active": True,
        "created_at": datetime.utcnow(),
    })
    del user_data["password"]  # Remove plain password

    # Create user
    created_user = await create_collection_item(
        collection=db.users,
        item=user_data
    )
    return User.parse_obj(created_user)

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: dict = Depends(get_current_active_user)
):
    return User.parse_obj(current_user) 