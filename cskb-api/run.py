#!/usr/bin/env python3
"""
Startup script for Customer Support Knowledge Base API
"""

import uvicorn
from config import API_HOST, API_PORT, API_WORKERS

if __name__ == "__main__":
    print(f"Starting Customer Support Knowledge Base API on {API_HOST}:{API_PORT}")
    print(f"Workers: {API_WORKERS}")
    print("Press Ctrl+C to stop")
    
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        workers=API_WORKERS,
        reload=False,  # Disable auto-reload to maintain service state
        log_level="info"
    )
