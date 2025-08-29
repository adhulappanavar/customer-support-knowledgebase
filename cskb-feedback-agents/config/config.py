import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from root folder
load_dotenv("../.env")

class Settings(BaseSettings):
    """Configuration settings for the Feedback Agents system."""
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8002
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 1000
    
    # Database Configuration
    ORIGINAL_KB_PATH: str = "../cskb-api/data/lancedb"
    ENHANCED_KB_PATH: str = "data/enhanced_kb"
    FEEDBACK_DB_PATH: str = "data/feedback.db"
    
    # Agent Configuration
    LEARNING_THRESHOLD: float = 0.7
    CONSISTENCY_THRESHOLD: float = 0.8
    QUALITY_THRESHOLD: float = 0.7
    MAX_VARIANTS_PER_SOLUTION: int = 5
    
    # Pattern Recognition
    ANALYSIS_FREQUENCY: str = "daily"
    MIN_PATTERN_FREQUENCY: int = 3
    
    # Workflow Configuration
    WORKFLOW_TIMEOUT: int = 300  # seconds
    MAX_RETRIES: int = 3
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Ensure directories exist
def ensure_directories():
    """Create necessary directories if they don't exist."""
    directories = [
        Path(settings.ENHANCED_KB_PATH),
        Path(settings.ENHANCED_KB_PATH).parent,
        Path("data"),
        Path("logs"),
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

# Initialize directories
ensure_directories()
