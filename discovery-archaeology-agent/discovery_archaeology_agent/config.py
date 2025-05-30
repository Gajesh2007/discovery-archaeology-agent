"""Configuration management for Discovery Archaeology Agent."""
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "o3-2025-04-16"
    
    # Database Configuration
    database_url: str = "sqlite:///./discovery_archaeology.db"
    
    # Application Configuration
    app_name: str = "Discovery Archaeology Agent"
    app_version: str = "0.1.0"
    debug: bool = False
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()