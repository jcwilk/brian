#!/bin/bash

# brian installation script
echo "🧠 Installing brian - Your Personal Knowledge Base"
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install dependencies one by one
echo ""
echo "Installing dependencies..."
python -m pip install fastapi
python -m pip install "uvicorn[standard]"
python -m pip install pydantic
python -m pip install python-multipart
python -m pip install aiofiles

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start brian, run:"
echo "  source venv/bin/activate"
echo "  python -m brian.main"
echo ""
