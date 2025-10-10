#!/bin/bash

# Desi Flavors Katy Dashboard Setup Script

echo "🚀 Setting up Desi Flavors Katy Financial Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment variables
if [ ! -f .env.local ]; then
    echo "📋 Creating environment variables file..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
else
    echo "✅ Environment variables file already exists"
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p db
mkdir -p lib/csv

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Set up your Supabase database using db/schema.sql"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🌐 Open http://localhost:3000 to view the dashboard"

