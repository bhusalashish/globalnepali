from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from mangum import Mangum
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from app.core.config import settings
from app.core.database import db
from app.api.v1.api import api_router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for Global Nepali platform",
    version="1.0.0",
    docs_url=None,  # Disable default docs
    redoc_url=None,  # Disable default redoc
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Maximum time to cache preflight requests (10 minutes)
)

# MongoDB connection
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    app.mongodb = app.mongodb_client[settings.DATABASE_NAME]
    await db.connect_to_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
    await db.close_database_connection()

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    """
    Initialize services on startup
    """
    logger.info("Starting up application...")
    await db.connect_to_database()

@app.on_event("shutdown")
async def shutdown_event():
    """
    Clean up services on shutdown
    """
    logger.info("Shutting down application...")
    await db.close_database_connection()

@app.get("/")
async def root():
    """
    Root endpoint for health check
    """
    return {
        "status": "healthy",
        "message": "Welcome to Global Nepali API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "database": "connected" if db.client else "disconnected"
    }

# AWS Lambda handler
handler = Mangum(app)

# Custom OpenAPI schema with security
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Add JWT bearer security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token in the format: Bearer <token>",
        }
    }

    # Don't apply security globally
    # Instead, let each endpoint define its own security through dependencies

    # Remove security from public endpoints
    for path, methods in openapi_schema["paths"].items():
        if path.endswith(("/login", "/register")):
            for method in methods.values():
                method.pop("security", None)
        elif path.endswith(("/articles/", "/articles/{article_id}")):
            for method, operation in methods.items():
                if method.lower() == "get":  # Only GET methods are public
                    operation.pop("security", None)
                else:  # POST, PUT, DELETE methods require auth
                    operation["security"] = [{"Bearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Custom docs endpoints
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    from fastapi.openapi.docs import get_redoc_html
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - ReDoc",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    ) 