from typing import Any, Dict, List, Optional, AsyncGenerator
from bson import ObjectId
from fastapi import HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure
from app.core.config import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(ObjectId(v))

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

PydanticObjectId = PyObjectId

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    async def connect_to_database(self):
        logger.info("Connecting to MongoDB...")
        try:
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                maxPoolSize=10,
                minPoolSize=1
            )
            self.db = self.client[settings.DATABASE_NAME]
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB.")
        except ConnectionFailure as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise

    async def close_database_connection(self):
        logger.info("Closing MongoDB connection...")
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

db = DatabaseManager()

async def get_db() -> AsyncIOMotorDatabase:
    """
    Dependency to get database instance.
    """
    return db.db

async def get_database() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    """
    Dependency to get database connection.
    """
    try:
        yield db.db
    except Exception as e:
        logger.error(f"Error accessing database: {e}")
        raise

async def get_collection(collection_name: str):
    """
    Get a collection from the database.
    """
    return db.db[collection_name]

async def create_document(collection_name: str, document: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new document in the specified collection.
    """
    collection = await get_collection(collection_name)
    document["created_at"] = datetime.utcnow()
    document["updated_at"] = document["created_at"]
    result = await collection.insert_one(document)
    return {**document, "_id": result.inserted_id}

async def update_document(
    collection_name: str,
    document_id: str,
    update_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Update a document in the specified collection.
    """
    collection = await get_collection(collection_name)
    update_data["updated_at"] = datetime.utcnow()
    await collection.update_one(
        {"_id": document_id},
        {"$set": update_data}
    )
    return await collection.find_one({"_id": document_id})

async def delete_document(collection_name: str, document_id: str) -> bool:
    """
    Delete a document from the specified collection.
    """
    collection = await get_collection(collection_name)
    result = await collection.delete_one({"_id": document_id})
    return result.deleted_count > 0

async def get_document(collection_name: str, document_id: str) -> Dict[str, Any]:
    """
    Get a document from the specified collection.
    """
    collection = await get_collection(collection_name)
    return await collection.find_one({"_id": document_id})

async def get_collection_items(
    collection: Any,
    query: Dict[str, Any] = {},
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[List[tuple]] = None,
) -> List[Dict[str, Any]]:
    """Generic function to get items from a MongoDB collection."""
    try:
        cursor = collection.find(query).skip(skip).limit(limit)
        if sort_by:
            cursor = cursor.sort(sort_by)
        return await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_collection_item(
    collection: Any,
    query: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """Generic function to get a single item from a MongoDB collection."""
    try:
        item = await collection.find_one(query)
        if not item:
            return None
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_collection_item(
    collection: Any,
    item: Dict[str, Any],
) -> Dict[str, Any]:
    """Generic function to create an item in a MongoDB collection."""
    try:
        result = await collection.insert_one(item)
        created_item = await collection.find_one({"_id": result.inserted_id})
        return created_item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_collection_item(
    collection: Any,
    query: Dict[str, Any],
    update_data: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """Generic function to update an item in a MongoDB collection."""
    try:
        result = await collection.find_one_and_update(
            query,
            {"$set": update_data},
            return_document=True,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_collection_item(
    collection: Any,
    query: Dict[str, Any],
) -> bool:
    """Generic function to delete an item from a MongoDB collection."""
    try:
        result = await collection.delete_one(query)
        return result.deleted_count > 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 