from datetime import datetime
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status, Security
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import (
    get_collection_items,
    get_collection_item,
    create_collection_item,
    update_collection_item,
    delete_collection_item,
    PyObjectId,
    get_db,
)
from app.api.v1.endpoints.auth import get_current_active_user, oauth2_scheme

router = APIRouter(tags=["sponsors"])

class SponsorContact(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

class SponsorBase(BaseModel):
    name: str
    description: str
    logo_url: str
    website_url: str
    tier: str
    contact: SponsorContact

class SponsorCreate(SponsorBase):
    pass

class SponsorUpdate(SponsorBase):
    pass

class Sponsor(SponsorBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: PyObjectId
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

class SponsorshipInquiry(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: str
    message: str
    desired_tier: str

@router.get("/", response_model=List[Sponsor])
async def list_sponsors(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    List all sponsors. No authentication required.
    """
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status

    sponsors = await get_collection_items(
        collection=db.sponsors,
        query=query,
        skip=skip,
        limit=limit,
        sort_by=[("created_at", -1)]
    )
    return [Sponsor.parse_obj(sponsor) for sponsor in sponsors]

@router.get("/{sponsor_id}", response_model=Sponsor)
async def get_sponsor(
    sponsor_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get sponsor details. No authentication required.
    """
    sponsor = await get_collection_item(
        collection=db.sponsors,
        query={"_id": PyObjectId(sponsor_id)}
    )
    if not sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")
    return Sponsor.parse_obj(sponsor)

@router.post("/", response_model=Sponsor)
async def create_sponsor(
    sponsor: SponsorCreate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Create a new sponsor. Only admin can create sponsors.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin can create sponsors."
        )

    sponsor_data = sponsor.dict()
    sponsor_data.update({
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "created_by": PyObjectId(current_user["_id"]),
    })

    created_sponsor = await create_collection_item(
        collection=db.sponsors,
        item=sponsor_data
    )
    return Sponsor.parse_obj(created_sponsor)

@router.put("/{sponsor_id}", response_model=Sponsor)
async def update_sponsor(
    sponsor_id: str,
    sponsor: SponsorUpdate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Update a sponsor. Only admin can update sponsors.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin can update sponsors."
        )

    existing_sponsor = await get_collection_item(
        collection=db.sponsors,
        query={"_id": PyObjectId(sponsor_id)}
    )
    if not existing_sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")

    sponsor_data = sponsor.dict()
    sponsor_data["updated_at"] = datetime.utcnow()

    updated_sponsor = await update_collection_item(
        collection=db.sponsors,
        query={"_id": PyObjectId(sponsor_id)},
        update_data=sponsor_data
    )
    return Sponsor.parse_obj(updated_sponsor)

@router.delete("/{sponsor_id}")
async def delete_sponsor(
    sponsor_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Delete a sponsor. Only admin can delete sponsors.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin can delete sponsors."
        )

    existing_sponsor = await get_collection_item(
        collection=db.sponsors,
        query={"_id": PyObjectId(sponsor_id)}
    )
    if not existing_sponsor:
        raise HTTPException(status_code=404, detail="Sponsor not found")

    await delete_collection_item(
        collection=db.sponsors,
        query={"_id": PyObjectId(sponsor_id)}
    )
    return {"message": "Sponsor deleted successfully"}

@router.post("/inquire")
async def submit_sponsorship_inquiry(
    inquiry: SponsorshipInquiry,
    current_user: dict = Depends(get_current_active_user)
):
    inquiry_data = inquiry.model_dump()
    inquiry_data.update({
        "user_id": current_user["_id"],
        "status": "pending",
        "submitted_at": datetime.utcnow(),
    })

    created_inquiry = await create_collection_item(
        collection=router.app.mongodb.sponsorship_inquiries,
        item=inquiry_data
    )
    return {"message": "Sponsorship inquiry submitted successfully"} 