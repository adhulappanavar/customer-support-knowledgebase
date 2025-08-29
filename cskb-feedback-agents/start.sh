#!/bin/bash

# CSKB Feedback Agents Startup Script

echo "🚀 Starting CSKB Feedback Agents System..."

# Check if Python 3.12+ is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python 3.12+ is required but not found"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
REQUIRED_VERSION="3.12"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python $REQUIRED_VERSION+ is required, but found $PYTHON_VERSION"
    exit 1
fi

echo "✅ Python version: $PYTHON_VERSION"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists in root folder
if [ ! -f "../.env" ]; then
    echo "❌ .env file not found in root folder"
    echo "📝 Please create .env file in the root directory with your OpenAI API key"
    echo "🔑 Get your API key from: https://platform.openai.com/api-keys"
    exit 1
fi

# Check if OpenAI API key is set in root .env
if grep -q "OPENAI_API_KEY=" "../.env" && ! grep -q "OPENAI_API_KEY=$" "../.env"; then
    echo "✅ OpenAI API key configured in root .env"
else
    echo "❌ Please set your OpenAI API key in root .env file"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/enhanced_kb
mkdir -p data/feedback_data
mkdir -p logs

# Start the application
echo "🚀 Starting Feedback Agents API on port 8002..."
echo "📖 API Documentation: http://localhost:8002/docs"
echo "🔍 Health Check: http://localhost:8002/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

$PYTHON_CMD main.py
