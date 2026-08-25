"""
Centralized application configuration.
Loads environment variables from .env.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM
    LLM_PROVIDER: str = "gemini"
    LLM_API_KEY: str
    LLM_MODEL_NAME: str = "gemini-3.6-flash"
    LLM_TEMPERATURE: float = 0.0
    LLM_MAX_TOKENS: int = 4096

    # Application
    APP_NAME: str = "AI Resume & JD Matcher"
    CORS_ORIGINS: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()