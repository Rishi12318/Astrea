from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ai_makeup_recommender"
    app_env: str = "development"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./makeup.db"
    redis_url: str | None = None
    model_dir: str = "./artifacts"
    upload_dir: str = "./uploads"
    cors_origins: str = "http://localhost:5173"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
