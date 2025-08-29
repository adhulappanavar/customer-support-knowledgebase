#!/bin/bash

# CSKB Feedback Agents Setup Script

echo "🚀 Setting up CSKB Feedback Agents..."

# Create data directories
mkdir -p data
mkdir -p enhanced_kb
mkdir -p logs

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_PATH=./data/feedback.db
ENHANCED_KB_PATH=./data/enhanced_kb

# Server Configuration
HOST=0.0.0.0
PORT=8002

# Logging
LOG_LEVEL=INFO
EOF
    echo "✅ .env file created with default configuration"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete! To start the system:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start backend: python main.py"
echo "3. In another terminal, start frontend: cd ../cskb-feedback-agent-reactui && npm start"
echo ""
echo "Backend will be available at: http://localhost:8002"
echo "Frontend will be available at: http://localhost:3000"
