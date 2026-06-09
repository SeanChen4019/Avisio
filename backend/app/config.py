from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./avisio.db"

    # JWT
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 72

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5200"]

    # AI (mock for now)
    AI_API_KEY: str = ""
    AI_API_BASE: str = "https://api.openai.com/v1"
    AI_MODEL: str = "gpt-4o"

    # Rate limit
    RATE_LIMIT_PER_MIN: int = 60

    # Server (for compatibility with old .env)
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # App
    APP_VERSION: str = "0.3.0"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
