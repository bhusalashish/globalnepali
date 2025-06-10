from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, events, articles, volunteers, sponsors

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(volunteers.router, prefix="/volunteers", tags=["volunteers"])
api_router.include_router(sponsors.router, prefix="/sponsors", tags=["sponsors"]) 