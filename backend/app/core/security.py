from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityManager:
    @staticmethod
    def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create JWT access token
        """
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode = {"exp": expire, "sub": str(subject)}
        try:
            encoded_jwt = jwt.encode(
                to_encode,
                settings.JWT_SECRET,
                algorithm=settings.JWT_ALGORITHM
            )
            return encoded_jwt
        except Exception as e:
            logger.error(f"Error creating access token: {e}")
            raise

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash
        """
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Error verifying password: {e}")
            return False

    @staticmethod
    def get_password_hash(password: str) -> str:
        """
        Hash a password
        """
        try:
            return pwd_context.hash(password)
        except Exception as e:
            logger.error(f"Error hashing password: {e}")
            raise

    @staticmethod
    def decode_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Decode and verify JWT token
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM]
            )
            return payload
        except JWTError as e:
            logger.error(f"Error decoding token: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {e}")
            raise

security = SecurityManager() 