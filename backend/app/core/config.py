from typing import List
from pydantic import BaseSettings
import json

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Global Nepali API"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite default dev server
        "http://localhost:3000",  # Next.js default
        "http://localhost:8000",  # Backend API
        "http://localhost",
        "https://globalnepali.org",
        "https://www.globalnepali.org",
        "https://api.globalnepali.org",
    ]

    # MongoDB settings
    MONGODB_URL: str = "mongodb://mongo:27017"
    DATABASE_NAME: str = "globalnepali"

    # JWT settings
    JWT_SECRET: str = "your-secret-key"  # Change this in production!
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Security settings
    SECRET_KEY: str = "your-secret-key"  # Change this in production!

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings object
settings = Settings() 