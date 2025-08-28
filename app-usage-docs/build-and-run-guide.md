# Build and Run Guide

This guide provides step-by-step instructions to build, configure, and run the Customer Support Knowledge Base system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Building the System](#building-the-system)
6. [Running the System](#running-the-system)
7. [Verification](#verification)
8. [Development Setup](#development-setup)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Python 3.12+** - [Download from python.org](https://www.python.org/downloads/)
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Required Accounts
- **OpenAI API Key** - [Get from OpenAI](https://platform.openai.com/api-keys)

### Verify Installations

```bash
# Check Python version
python3 --version
# Should show Python 3.12.x or higher

# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 8.x.x or higher

# Check Git version
git --version
# Should show git version 2.x.x or higher
```

## System Requirements

### Minimum Requirements
- **RAM**: 4GB
- **Storage**: 2GB free space
- **CPU**: 2 cores
- **OS**: macOS 10.15+, Ubuntu 18.04+, Windows 10+

### Recommended Requirements
- **RAM**: 8GB+
- **Storage**: 5GB+ free space
- **CPU**: 4+ cores
- **OS**: Latest stable versions

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd customer-support-knowledgebase

# Verify directory structure
ls -la
```

**Expected Output:**
```
total 8
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 .
drwxr-xr-x  3 user  staff   96 Aug 28 16:30 ..
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 cskb-api
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 cskb-react-ui
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 cskb-ticketing-app
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 app-usage-docs
```

### 2. Set Up Python Environment

```bash
# Navigate to the API directory
cd cskb-api

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Verify activation
which python
# Should show path to venv/bin/python
```

### 3. Install Python Dependencies

```bash
# Ensure pip is up to date
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify installations
pip list
```

**Expected Output:**
```
Package                Version
---------------------- -------
agno                   0.1.0
fastapi                0.104.1
lancedb                0.4.0
openai                 1.3.0
pydantic               2.5.0
PyPDF2                 3.0.1
python-dotenv         1.0.0
uvicorn                0.24.0
...
```

### 4. Set Up Node.js Environment

```bash
# Navigate to React UI directory
cd ../cskb-react-ui

# Install Node.js dependencies
npm install

# Verify installations
npm list --depth=0
```

**Expected Output:**
```
cskb-react-ui@0.1.0
├── @emotion/react@11.11.1
├── @emotion/styled@11.11.0
├── @mui/icons-material@5.14.19
├── @mui/material@5.14.20
├── axios@1.6.2
├── react@18.2.0
├── react-dom@18.2.0
└── typescript@5.3.3
```

### 5. Set Up Ticketing App

```bash
# Navigate to ticketing app directory
cd ../cskb-ticketing-app

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

## Configuration

### 1. Environment Variables

Create `.env` file in the `cskb-api` directory:

```bash
cd ../cskb-api

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
EOF

# Verify file creation
cat .env
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 2. Database Configuration

The system uses SQLite for ticketing data and LanceDB for vector storage. No additional configuration is needed for development.

### 3. Port Configuration

Default ports used by the system:
- **RAG API**: 8000
- **Ticketing API**: 8001
- **React UI**: 3000

To change ports, modify the respective configuration files.

## Building the System

### 1. Build React Application

```bash
# Navigate to React UI directory
cd ../cskb-react-ui

# Build for production
npm run build

# Verify build output
ls -la build/
```

**Expected Output:**
```
total 8
drwxr-xr-x  6 user  staff  192 Aug 28 16:35 build
drwxr-xr-x  8 user  staff  256 Aug 28 16:35 node_modules
drwxr-xr-x  8 user  staff  256 Aug 28 16:35 public
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 src
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 package.json
drwxr-xr-x  8 user  staff  256 Aug 28 16:30 tsconfig.json
```

### 2. Verify Python Dependencies

```bash
# Navigate to API directory
cd ../cskb-api

# Check if all dependencies are installed
python3 -c "import fastapi, agno, lancedb, openai, PyPDF2; print('All dependencies imported successfully')"
```

**Expected Output:**
```
All dependencies imported successfully
```

## Running the System

### 1. Start the RAG API

```bash
# Navigate to API directory
cd cskb-api

# Activate virtual environment
source venv/bin/activate

# Start the server
python3 main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 2. Start the Ticketing API

Open a new terminal window:

```bash
# Navigate to ticketing app directory
cd cskb-ticketing-app

# Activate virtual environment
source venv/bin/activate

# Start the server
python3 main.py
```

**Expected Output:**
```
✅ Database initialized: tickets.db
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
```

### 3. Start the React UI

Open another new terminal window:

```bash
# Navigate to React UI directory
cd cskb-react-ui

# Start development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view cskb-react-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

## Verification

### 1. Check API Health

```bash
# Check RAG API health
curl -X GET http://localhost:8000/health

# Check Ticketing API health
curl -X GET http://localhost:8001/health
```

**Expected Responses:**
```json
// RAG API
{
  "status": "healthy",
  "service": "Customer Support Knowledge Base API"
}

// Ticketing API
{
  "status": "healthy",
  "service": "Ticket Management System"
}
```

### 2. Check React UI

Open your browser and navigate to `http://localhost:3000`. You should see:
- Navigation tabs (PDF Upload, Knowledge Query, Ticketing System)
- Clean, modern interface
- No console errors

### 3. Test Basic Functionality

```bash
# Test PDF upload endpoint
curl -X GET http://localhost:8000/documents

# Test ticketing endpoint
curl -X GET http://localhost:8001/tickets
```

## Development Setup

### 1. Enable Auto-Reload

For development, you can enable auto-reload:

```bash
# RAG API with auto-reload
cd cskb-api
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ticketing API with auto-reload
cd ../cskb-ticketing-app
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 2. Development Scripts

Create convenience scripts for development:

```bash
# Create start-dev.sh script
cd ..
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start RAG API
cd cskb-api
source venv/bin/activate
python3 main.py &
RAG_PID=$!

# Start Ticketing API
cd ../cskb-ticketing-app
source venv/bin/activate
python3 main.py &
TICKETING_PID=$!

# Start React UI
cd ../cskb-react-ui
npm start &
REACT_PID=$!

echo "All services started:"
echo "RAG API PID: $RAG_PID"
echo "Ticketing API PID: $TICKETING_PID"
echo "React UI PID: $REACT_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "kill $RAG_PID $TICKETING_PID $REACT_PID; exit" INT
wait
EOF

# Make executable
chmod +x start-dev.sh
```

### 3. Environment Management

For different environments, create multiple `.env` files:

```bash
# Development environment
cd cskb-api
cp .env .env.development

# Production environment
cp .env .env.production

# Test environment
cp .env .env.test
```

## Production Deployment

### 1. Build Production Assets

```bash
# Build React app for production
cd cskb-react-ui
npm run build

# Verify production build
ls -la build/
```

### 2. Production Server Setup

```bash
# Install production dependencies
cd ../cskb-api
pip install gunicorn

# Create production start script
cat > start-prod.sh << 'EOF'
#!/bin/bash

# Start RAG API with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 &

# Start Ticketing API with Gunicorn
cd ../cskb-ticketing-app
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001 &

# Serve React build with a simple HTTP server
cd ../cskb-react-ui/build
python3 -m http.server 3000 &

echo "Production services started"
echo "RAG API: http://localhost:8000"
echo "Ticketing API: http://localhost:8001"
echo "React UI: http://localhost:3000"
EOF

chmod +x start-prod.sh
```

### 3. Docker Deployment

Create `Dockerfile` for containerized deployment:

```bash
# Create Dockerfile for RAG API
cd ../cskb-api
cat > Dockerfile << 'EOF'
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python3", "main.py"]
EOF

# Create docker-compose.yml
cd ..
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  rag-api:
    build: ./cskb-api
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./data:/app/data

  ticketing-api:
    build: ./cskb-ticketing-app
    ports:
      - "8001:8001"
    volumes:
      - ./tickets.db:/app/tickets.db

  react-ui:
    build: ./cskb-react-ui
    ports:
      - "3000:3000"
    depends_on:
      - rag-api
      - ticketing-api
EOF
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find processes using ports
lsof -i :8000 -i :8001 -i :3000

# Kill specific process
kill <PID>

# Or use different ports
python3 main.py --port 8002
```

#### 2. Virtual Environment Issues

```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Node.js Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. OpenAI API Key Issues

```bash
# Verify API key in .env file
cat .env

# Test API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### 5. Database Issues

```bash
# Reinitialize database
cd cskb-ticketing-app
rm -f tickets.db
python3 main.py
```

### Debug Commands

```bash
# Check service status
curl -X GET http://localhost:8000/health
curl -X GET http://localhost:8001/health

# Check logs
tail -f /var/log/syslog | grep -E "(8000|8001|3000)"

# Check process status
ps aux | grep -E "(python3|node|npm)"
```

### Performance Monitoring

```bash
# Monitor resource usage
htop

# Monitor network connections
netstat -tulpn | grep -E "(8000|8001|3000)"

# Monitor disk usage
df -h
du -sh cskb-api/data cskb-ticketing-app/
```

## Quick Start Commands

### One-Command Setup

```bash
# Complete setup and start
git clone <repository-url> && \
cd customer-support-knowledgebase && \
cd cskb-api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && \
cd ../cskb-react-ui && npm install && \
cd ../cskb-ticketing-app && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && \
cd ../cskb-api && echo "OPENAI_API_KEY=your_key_here" > .env && \
cd .. && ./start-dev.sh
```

### Service Management

```bash
# Start all services
./start-dev.sh

# Stop all services
pkill -f "python3 main.py"
pkill -f "npm start"

# Restart specific service
pkill -f "cskb-api" && cd cskb-api && source venv/bin/activate && python3 main.py &
```

---

This guide covers the complete build and run process. For system architecture details, refer to `high-level-app-description.md`. For testing instructions, refer to `testing-guide.md`.
