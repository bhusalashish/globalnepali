from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status, Security
from pydantic import BaseModel, Field
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

router = APIRouter(tags=["events"])

class EventBase(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    capacity: int
    category: str

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class Event(EventBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    registered_count: int = 0
    registered_users: List[PyObjectId] = []
    status: str = "upcoming"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: PyObjectId
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

@router.get("/", response_model=List[Event])
async def list_events(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category

    events = await get_collection_items(
        collection=db.events,
        query=query,
        skip=skip,
        limit=limit,
        sort_by=[("date", 1)]
    )
    return [Event.parse_obj(event) for event in events]

@router.get("/{event_id}", response_model=Event)
async def get_event(
    event_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    event = await get_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)}
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event.parse_obj(event)

@router.post("/", response_model=Event)
async def create_event(
    event: EventCreate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Create a new event. Only admin and editor roles can create events.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin and editor roles can create events."
        )

    event_data = event.dict()
    event_data.update({
        "organizer": {
            "id": PyObjectId(current_user["_id"]),
            "name": current_user["full_name"],
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })

    created_event = await create_collection_item(
        collection=db.events,
        item=event_data
    )
    return Event.parse_obj(created_event)

@router.put("/{event_id}", response_model=Event)
async def update_event(
    event_id: str,
    event: EventUpdate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Update an event. Only admin, editor, or the event organizer can update it.
    Requires authentication with Bearer token.
    """
    existing_event = await get_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)}
    )
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if (current_user["role"] not in ["admin", "editor"] and
        existing_event["organizer"]["id"] != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    event_data = event.dict()
    event_data["updated_at"] = datetime.utcnow()

    updated_event = await update_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)},
        update_data=event_data
    )
    return Event.parse_obj(updated_event)

@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Delete an event. Only admin, editor, or the event organizer can delete it.
    Requires authentication with Bearer token.
    """
    existing_event = await get_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)}
    )
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if (current_user["role"] not in ["admin", "editor"] and
        existing_event["organizer"]["id"] != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    await delete_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)}
    )
    return {"message": "Event deleted successfully"}

@router.post("/{event_id}/register")
async def register_for_event(
    event_id: str,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Register for an event. Any authenticated user can register.
    Requires authentication with Bearer token.
    """
    event = await get_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)}
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if user is already registered
    if any(reg["user_id"] == current_user["_id"] for reg in event.get("registrations", [])):
        raise HTTPException(status_code=400, detail="Already registered for this event")

    registration = {
        "user_id": PyObjectId(current_user["_id"]),
        "user_name": current_user["full_name"],
        "registered_at": datetime.utcnow()
    }

    updated_event = await update_collection_item(
        collection=db.events,
        query={"_id": PyObjectId(event_id)},
        update_data={
            "registrations": [*event.get("registrations", []), registration],
            "updated_at": datetime.utcnow()
        }
    )
    return {"message": "Successfully registered for the event"} 