#!/bin/bash

# CSKB Merged UI Setup Script

echo "🚀 Setting up CSKB Merged Workflow UI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if backend services are running
echo "🔍 Checking backend services..."

# Check Knowledge API (port 8000)
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Knowledge API (cskb-api) is running on port 8000"
else
    echo "⚠️  Knowledge API (cskb-api) is not running on port 8000"
    echo "   Please start it first: cd ../cskb-api && python main.py"
fi

# Check Feedback API (port 8002)
if curl -s http://localhost:8002/system/health > /dev/null; then
    echo "✅ Feedback API (cskb-feedback-agents) is running on port 8002"
else
    echo "⚠️  Feedback API (cskb-feedback-agents) is not running on port 8002"
    echo "   Please start it first: cd ../cskb-feedback-agents && python main.py"
fi

echo ""
echo "🎉 Setup complete! To start the merged UI:"
echo "1. Ensure both backend services are running:"
echo "   - cskb-api on port 8000"
echo "   - cskb-feedback-agents on port 8002"
echo ""
echo "2. Start the React development server:"
echo "   npm start"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"

