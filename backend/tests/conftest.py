import os
import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from fastapi.testclient import TestClient
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from typing import AsyncGenerator, Generator
from app.main import app
from app.core.config import settings
from app.core.security import security

# Test database name
TEST_DB_NAME = "test_globalnepali"

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def test_app() -> FastAPI:
    """Create a test instance of the FastAPI application."""
    return app

@pytest.fixture
async def test_client(test_app: FastAPI) -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client for making HTTP requests."""
    async with LifespanManager(test_app):
        async with AsyncClient(app=test_app, base_url="http://test") as client:
            yield client

@pytest.fixture(autouse=True)
async def setup_test_db():
    """Set up a test database and clean it after each test."""
    # Store original database name
    original_db_name = settings.DATABASE_NAME
    
    # Set test database name
    settings.DATABASE_NAME = TEST_DB_NAME
    
    # Create MongoDB client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[TEST_DB_NAME]
    
    # Make the db available to the app
    app.mongodb_client = client
    app.mongodb = db
    
    yield db
    
    # Clean up: drop test database and close connection
    await client.drop_database(TEST_DB_NAME)
    client.close()
    
    # Restore original database name
    settings.DATABASE_NAME = original_db_name

@pytest.fixture
def test_user_data():
    """Test user data fixture."""
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "confirm_password": "testpassword123",
        "full_name": "Test User"
    }

@pytest.fixture
async def test_user_token(test_client: AsyncClient, test_user_data):
    """Create a test user and return their authentication token."""
    # Register user
    await test_client.post("/api/v1/auth/register", json=test_user_data)
    
    # Login and get token
    response = await test_client.post("/api/v1/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })
    
    token_data = response.json()
    return token_data["access_token"]

@pytest.fixture
async def authorized_client(test_client: AsyncClient, test_user_token: str):
    """Create an authorized test client with authentication headers."""
    test_client.headers["Authorization"] = f"Bearer {test_user_token}"
    return test_client

@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """
    Create a new FastAPI test client.
    """
    with TestClient(app) as client:
        yield client

@pytest.fixture
async def mongodb_client():
    """
    Create a new MongoDB client instance for testing.
    Uses a separate test database.
    """
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    yield client
    await client.drop_database(settings.DATABASE_NAME + "_test")
    client.close()

@pytest.fixture
async def test_db(mongodb_client):
    """
    Return the test database instance
    """
    return mongodb_client[settings.DATABASE_NAME + "_test"]

@pytest.fixture
def test_user():
    """
    Return a test user for authentication testing
    """
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

@pytest.fixture
def test_user_token(test_user):
    """
    Create a valid token for the test user
    """
    return security.create_access_token(subject=test_user["email"])

@pytest.fixture
def authorized_client(client: TestClient, test_user_token: str):
    """
    Return an authorized client for testing protected endpoints
    """
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {test_user_token}"
    }
    return client 