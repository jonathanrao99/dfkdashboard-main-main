@echo off
REM Desi Flavors Katy Dashboard Setup Script for Windows

echo 🚀 Setting up Desi Flavors Katy Financial Dashboard...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment variables
if not exist .env.local (
    echo 📋 Creating environment variables file...
    copy .env.local.example .env.local
    echo ⚠️  Please update .env.local with your Supabase credentials
) else (
    echo ✅ Environment variables file already exists
)

REM Create necessary directories
echo 📁 Creating project directories...
if not exist db mkdir db
if not exist lib\csv mkdir lib\csv

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Update .env.local with your Supabase credentials
echo 2. Set up your Supabase database using db/schema.sql
echo 3. Run 'npm run dev' to start the development server
echo.
echo 🌐 Open http://localhost:3000 to view the dashboard
pause

