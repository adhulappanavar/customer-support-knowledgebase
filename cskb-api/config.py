import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).parent

# Data directories
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
LANCEDB_DIR = DATA_DIR / "lancedb"

# API settings
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_WORKERS = int(os.getenv("API_WORKERS", "1"))

# OpenAI settings
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Vector database settings
VECTOR_DB_TABLE = os.getenv("VECTOR_DB_TABLE", "customer_support_kb")
VECTOR_DB_URI = str(LANCEDB_DIR)

# File upload settings
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "50")) * 1024 * 1024  # 50MB default
ALLOWED_EXTENSIONS = {".pdf"}

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)
LANCEDB_DIR.mkdir(exist_ok=True)
