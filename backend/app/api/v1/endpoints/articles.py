from datetime import datetime
from typing import List, Optional, Dict, Any
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

# Create router without global dependencies
router = APIRouter(tags=["articles"])

class ArticleBase(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: str
    tags: List[str]

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(ArticleBase):
    pass

class ArticleAuthor(BaseModel):
    id: PyObjectId
    name: str
    avatar: str = ""

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

class Article(ArticleBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author: ArticleAuthor
    published_at: datetime = Field(default_factory=datetime.utcnow)
    likes_count: int = 0
    views_count: int = 0
    comments_count: int = 0
    liked_by: List[PyObjectId] = []
    status: str = "published"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        json_encoders = {PyObjectId: str}

@router.get("/", response_model=List[Article])
async def list_articles(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    tag: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    List all articles. No authentication required.
    """
    query = {}
    if tag:
        query["tags"] = tag
    if status:
        query["status"] = status

    articles = await get_collection_items(
        collection=db.articles,
        query=query,
        skip=skip,
        limit=limit,
        sort_by=[("published_at", -1)]
    )
    return [Article.parse_obj(doc) for doc in articles]

@router.get("/{article_id}", response_model=Article)
async def get_article(
    article_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    article = await get_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)}
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Increment view count
    updated_article = await update_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)},
        update_data={"views_count": article["views_count"] + 1}
    )
    return Article.parse_obj(updated_article)

@router.post("/", response_model=Article)
async def create_article(
    article: ArticleCreate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Create a new article. Only admin and editor roles can create articles.
    Requires authentication with Bearer token.
    """
    if not current_user.get("role") in ["admin", "editor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only admin and editor roles can create articles."
        )

    article_data = article.dict()
    article_data.update({
        "author": {
            "id": PyObjectId(current_user["_id"]),
            "name": current_user["full_name"],
            "avatar": current_user.get("avatar", ""),
        },
        "likes_count": 0,
        "views_count": 0,
        "comments_count": 0,
        "liked_by": [],
        "status": "published",
        "created_at": datetime.utcnow(),
        "published_at": datetime.utcnow(),
    })

    created_article = await create_collection_item(
        collection=db.articles,
        item=article_data
    )
    return Article.parse_obj(created_article)

@router.put("/{article_id}", response_model=Article)
async def update_article(
    article_id: str,
    article: ArticleUpdate,
    token: str = Security(oauth2_scheme),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    existing_article = await get_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)}
    )
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")

    if (current_user["role"] not in ["admin", "editor"] and
        existing_article["author"]["id"] != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    article_data = article.dict()
    article_data["updated_at"] = datetime.utcnow()

    updated_article = await update_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)},
        update_data=article_data
    )
    return Article.parse_obj(updated_article)

@router.delete("/{article_id}")
async def delete_article(
    article_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    existing_article = await get_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)}
    )
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")

    if (current_user["role"] not in ["admin", "editor"] and
        existing_article["author"]["id"] != current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    deleted = await delete_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)}
    )
    return {"message": "Article deleted successfully"}

@router.post("/{article_id}/like")
async def like_article(
    article_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    article = await get_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)}
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    if PyObjectId(current_user["_id"]) in article["liked_by"]:
        # Unlike
        updated_article = await update_collection_item(
            collection=db.articles,
            query={"_id": PyObjectId(article_id)},
            update_data={
                "liked_by": [
                    user for user in article["liked_by"]
                    if user != PyObjectId(current_user["_id"])
                ],
                "likes_count": article["likes_count"] - 1,
                "updated_at": datetime.utcnow(),
            }
        )
        return {"message": "Article unliked successfully"}

    # Like
    updated_article = await update_collection_item(
        collection=db.articles,
        query={"_id": PyObjectId(article_id)},
        update_data={
            "liked_by": [*article["liked_by"], PyObjectId(current_user["_id"])],
            "likes_count": article["likes_count"] + 1,
            "updated_at": datetime.utcnow(),
        }
    )
    return {"message": "Article liked successfully"} 