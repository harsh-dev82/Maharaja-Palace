#!/bin/bash

# Maharaja Palace - Setup Script
# This script sets up both backend and frontend

echo "🏰 Welcome to Maharaja Palace Hotel Booking System Setup"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Backend Setup
echo "🔧 Setting up Backend..."
echo "------------------------"

cd backend

if [ -f "package.json" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found. Please configure it manually:"
        echo "  - Copy from .env.example or use default values"
        echo "  - Update MONGODB_URI, JWT_SECRET, EMAIL settings"
    else
        echo "✅ .env file found"
    fi
else
    echo "❌ Backend package.json not found"
    exit 1
fi

cd ..
echo ""

# Frontend Setup
echo "🎨 Setting up Frontend..."
echo "------------------------"

cd frontend

if [ -f "package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend package.json not found"
    exit 1
fi

cd ..
echo ""

# Summary
echo "✅ Setup Complete!"
echo "=========================================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Terminal 1 - Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📌 Make sure:"
echo "   - MongoDB is running (mongod)"
echo "   - .env file in backend is configured"
echo ""
echo "Happy Coding! 🎉"
