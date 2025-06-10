from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Security
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.database import (
    get_collection_items,
    get_collection_item,
    update_collection_item,
    delete_collection_item,
    PydanticObjectId,
    get_db,
    get_database,
    get_collection,
)
from app.api.v1.endpoints.auth import get_current_active_user, oauth2_scheme
from app.schemas.user import UserRole

router = APIRouter()

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    interests: List[str] = []

class UserUpdate(BaseModel):
    role: Optional[UserRole] = None
    full_name: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    interests: Optional[List[str]] = None

class User(UserBase):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
    role: UserRole = UserRole.USER
    disabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PydanticObjectId: str}

@router.get("/", response_model=List[User])
async def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    List all users. Only admin can access this endpoint.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin can list users."
        )

    users = await get_collection_items(
        collection=db.users,
        query={},
        skip=skip,
        limit=limit,
        sort_by=[("created_at", -1)]
    )
    return [User.parse_obj(user) for user in users]

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get user details. Only admin or the user themselves can access this endpoint.
    Requires authentication with Bearer token.
    """
    if current_user.get("role") != "admin" and str(current_user["_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    user = await get_collection_item(
        collection=db.users,
        query={"_id": PydanticObjectId(user_id)}
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User.parse_obj(user)

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Update user details. Only admin or the user themselves can update.
    Requires authentication with Bearer token.
    """
    if current_user.get("role") != "admin" and str(current_user["_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    existing_user = await get_collection_item(
        collection=db.users,
        query={"_id": PydanticObjectId(user_id)}
    )
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    update_data["updated_at"] = datetime.utcnow()

    updated_user = await update_collection_item(
        collection=db.users,
        query={"_id": PydanticObjectId(user_id)},
        update_data=update_data
    )
    return User.parse_obj(updated_user)

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Delete a user. Only admin can delete users.
    Requires authentication with Bearer token.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin can delete users."
        )

    existing_user = await get_collection_item(
        collection=db.users,
        query={"_id": PydanticObjectId(user_id)}
    )
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    await delete_collection_item(
        collection=db.users,
        query={"_id": PydanticObjectId(user_id)}
    )
    return {"message": "User deleted successfully"}

@router.put("/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: UserRole,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update a user's role. Only superusers can perform this action.
    """
    if not current_user.get("is_superuser"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    users_collection = await get_collection("users")
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": role, "updated_at": datetime.utcnow()}}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": f"User role updated to {role}"} 