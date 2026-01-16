"""
Configuration for brian
"""
import os
from pathlib import Path


class Config:
    """Application configuration"""
    
    # Database
    DB_PATH = os.getenv("BRIAN_DB_PATH", str(Path.home() / ".brian" / "brian.db"))
    
    # API
    API_HOST = os.getenv("BRIAN_HOST", "127.0.0.1")
    API_PORT = int(os.getenv("BRIAN_PORT", "8080"))
    DEBUG = os.getenv("BRIAN_DEBUG", "false").lower() == "true"
    
    # Application
    APP_NAME = "brian"
    APP_VERSION = "0.1.0"
    APP_DESCRIPTION = "Your personal knowledge base - a play on brain"
    
    # CORS (for desktop app)
    CORS_ORIGINS = [
        "http://localhost:*",
        "http://127.0.0.1:*",
        "app://brian",
    ]
