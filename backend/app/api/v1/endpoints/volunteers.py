from datetime import datetime
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, status, Security
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi.security import OAuth2PasswordBearer

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

router = APIRouter(tags=["volunteers"])

class OpportunityBase(BaseModel):
    title: str
    description: str
    requirements: List[str]
    category: str
    location: str
    commitment: str
    capacity: int

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(OpportunityBase):
    pass

class OpportunityApplication(BaseModel):
    message: str
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    availability: str
    references: Optional[List[Dict[str, str]]] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

class Opportunity(OpportunityBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    applications_count: int = 0
    applicants: List[PyObjectId] = []
    status: str = "open"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: PyObjectId
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

@router.get("/", response_model=List[Opportunity])
async def list_opportunities(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status

    opportunities = await get_collection_items(
        collection=db.volunteer_opportunities,
        query=query,
        skip=skip,
        limit=limit,
        sort_by=[("created_at", -1)]
    )
    return [Opportunity.parse_obj(opp) for opp in opportunities]

@router.get("/{opportunity_id}", response_model=Opportunity)
async def get_opportunity(
    opportunity_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    opportunity = await get_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)}
    )
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return Opportunity.parse_obj(opportunity)

@router.post("/", response_model=Opportunity)
async def create_opportunity(
    opportunity: OpportunityCreate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Create a new volunteer opportunity. Only admin and editor roles can create opportunities.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin and editor roles can create volunteer opportunities."
        )

    opportunity_data = opportunity.dict()
    opportunity_data.update({
        "applications_count": 0,
        "applicants": [],
        "status": "open",
        "created_at": datetime.utcnow(),
        "created_by": PyObjectId(current_user["_id"]),
        "updated_at": datetime.utcnow(),
    })

    created_opportunity = await create_collection_item(
        collection=db.volunteer_opportunities,
        item=opportunity_data
    )
    return Opportunity.parse_obj(created_opportunity)

@router.put("/{opportunity_id}", response_model=Opportunity)
async def update_opportunity(
    opportunity_id: str,
    opportunity: OpportunityUpdate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Update a volunteer opportunity. Only admin, editor, or the organizer can update it.
    Requires authentication with Bearer token.
    """
    existing_opportunity = await get_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)}
    )
    if not existing_opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if (current_user["role"] not in ["admin", "editor"] and
        str(existing_opportunity["created_by"]) != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    opportunity_data = opportunity.dict()
    opportunity_data["updated_at"] = datetime.utcnow()

    updated_opportunity = await update_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)},
        update_data=opportunity_data
    )
    return Opportunity.parse_obj(updated_opportunity)

@router.delete("/{opportunity_id}")
async def delete_opportunity(
    opportunity_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Delete a volunteer opportunity. Only admin, editor, or the organizer can delete it.
    Requires authentication with Bearer token.
    """
    existing_opportunity = await get_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)}
    )
    if not existing_opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if (current_user["role"] not in ["admin", "editor"] and
        str(existing_opportunity["created_by"]) != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    deleted = await delete_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)}
    )
    return {"message": "Opportunity deleted successfully"}

@router.post("/{opportunity_id}/apply")
async def apply_for_opportunity(
    opportunity_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Apply for a volunteer opportunity. Any authenticated user can apply.
    Requires authentication with Bearer token.
    """
    opportunity = await get_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)}
    )
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if opportunity["status"] != "open":
        raise HTTPException(status_code=400, detail="This opportunity is no longer accepting applications")

    if opportunity["applications_count"] >= opportunity["capacity"]:
        raise HTTPException(status_code=400, detail="This opportunity has reached its capacity")

    if PyObjectId(current_user["_id"]) in opportunity["applicants"]:
        raise HTTPException(status_code=400, detail="You have already applied for this opportunity")

    # Store application in a separate collection
    application_data = {
        "opportunity_id": PyObjectId(opportunity_id),
        "user_id": PyObjectId(current_user["_id"]),
        "user_name": current_user["full_name"],
        "user_email": current_user["email"],
        "status": "pending",
        "created_at": datetime.utcnow(),
    }

    await create_collection_item(
        collection=db.volunteer_applications,
        item=application_data
    )

    # Update opportunity stats
    updated_opportunity = await update_collection_item(
        collection=db.volunteer_opportunities,
        query={"_id": PyObjectId(opportunity_id)},
        update_data={
            "applicants": [*opportunity["applicants"], PyObjectId(current_user["_id"])],
            "applications_count": opportunity["applications_count"] + 1,
            "updated_at": datetime.utcnow(),
        }
    )
    return {"message": "Application submitted successfully"} 