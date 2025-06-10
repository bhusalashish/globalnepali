import pytest
from httpx import AsyncClient
from fastapi import status
from app.core.security import security

pytestmark = pytest.mark.asyncio

async def test_register_user(client: AsyncClient):
    """Test user registration"""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "avatar": "https://example.com/avatar.jpg"
    }
    
    response = await client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "hashed_password" not in data
    assert data["role"] == "user"
    assert data["is_active"] is True

async def test_register_duplicate_email(client: AsyncClient):
    """Test registration with existing email"""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "avatar": "https://example.com/avatar.jpg"
    }
    
    # Register first time
    response = await client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200

    # Try to register again
    response = await client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

async def test_login_user(client: AsyncClient):
    """Test user login"""
    # Register user first
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "avatar": "https://example.com/avatar.jpg"
    }
    await client.post("/api/v1/auth/register", json=user_data)

    # Try to login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

async def test_login_wrong_password(client: AsyncClient):
    """Test login with wrong password"""
    # Register user first
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "avatar": "https://example.com/avatar.jpg"
    }
    await client.post("/api/v1/auth/register", json=user_data)

    # Try to login with wrong password
    login_data = {
        "username": user_data["email"],
        "password": "wrongpassword"
    }
    response = await client.post("/api/v1/auth/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

async def test_get_current_user(client: AsyncClient, test_user_token: str):
    """Test getting current user details"""
    headers = {"Authorization": f"Bearer {test_user_token}"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert "full_name" in data
    assert "hashed_password" not in data

async def test_get_current_user_invalid_token(client: AsyncClient):
    """Test accessing protected endpoint with invalid token"""
    headers = {"Authorization": "Bearer invalid_token"}
    response = await client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials" 