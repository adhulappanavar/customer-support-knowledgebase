#!/bin/bash

# Ticket Management System Startup Script

echo "🚀 Starting Ticket Management System..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import fastapi, uvicorn, pydantic" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Installing required packages..."
    pip3 install -r requirements.txt
fi

# Create database directory if it doesn't exist
mkdir -p data

# Start the application
echo "🌟 Starting FastAPI server on port 8001..."
echo "📖 API Documentation will be available at: http://localhost:8001/docs"
echo "🔍 Interactive API docs at: http://localhost:8001/redoc"
echo "🏥 Health check at: http://localhost:8001/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 main.py
