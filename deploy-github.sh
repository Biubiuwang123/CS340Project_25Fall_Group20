#!/bin/bash
# GitHub-based deployment script for CS340 Project
# Usage: ./deploy-github.sh your-onid [password]

ONID=$1
PASSWORD=$2
SERVER="classwork.engr.oregonstate.edu"
REPO_URL="https://github.com/Biubiuwang123/CS340Project_25Fall_Group20.git"
PROJECT_DIR="cs340/project/home"
APP_DIR="beaver-stationary"

if [ -z "$ONID" ]; then
    echo "❌ Error: ONID required"
    echo "Usage: ./deploy-github.sh your-onid [password]"
    exit 1
fi

# Check if sshpass is available, if not, try to use password
if command -v sshpass &> /dev/null && [ -n "$PASSWORD" ]; then
    export SSHPASS="$PASSWORD"
    SSH_CMD="sshpass -e ssh -o StrictHostKeyChecking=no"
elif [ -n "$PASSWORD" ]; then
    echo "⚠️  sshpass not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install hudochenkov/sshpass/sshpass
            export SSHPASS="$PASSWORD"
            SSH_CMD="sshpass -e ssh -o StrictHostKeyChecking=no"
        else
            echo "❌ Please install sshpass: brew install hudochenkov/sshpass/sshpass"
            exit 1
        fi
    else
        echo "❌ Please install sshpass: sudo apt-get install sshpass"
        exit 1
    fi
else
    SSH_CMD="ssh -o StrictHostKeyChecking=no"
fi

echo "🚀 Starting deployment to $SERVER..."
echo "📦 Step 1: Setting up directory structure and cloning repository..."

# SSH into server and set up the project
$SSH_CMD $ONID@$SERVER << ENDSSH
# Create the directory structure
mkdir -p ~/$PROJECT_DIR
cd ~/$PROJECT_DIR

# Clone the repository (this will create CS340Project_25Fall_Group20 folder)
if [ -d "CS340Project_25Fall_Group20" ]; then
    echo "📁 Repository already exists. Pulling latest changes..."
    cd CS340Project_25Fall_Group20
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone $REPO_URL
    cd CS340Project_25Fall_Group20
fi

# Copy project files to working directory (keeping original unchanged)
echo "📋 Setting up working directory..."
cd ~/$PROJECT_DIR
if [ -d "$APP_DIR" ]; then
    echo "⚠️  Working directory already exists. Backing up..."
    mv $APP_DIR ${APP_DIR}_backup_$(date +%Y%m%d_%H%M%S)
fi

# Copy the project folder to working directory
cp -r CS340Project_25Fall_Group20/project $APP_DIR
# Copy SQL files to parent directory (where run-sql-files.js expects them)
cp CS340Project_25Fall_Group20/DDL.sql ~/$PROJECT_DIR/
cp CS340Project_25Fall_Group20/DML.sql ~/$PROJECT_DIR/
cp CS340Project_25Fall_Group20/PL.sql ~/$PROJECT_DIR/

cd $APP_DIR

echo "📦 Step 2: Installing dependencies..."
npm install

echo "🗄️  Step 3: Setting up database..."
node run-sql-files.js

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. cd ~/$PROJECT_DIR/$APP_DIR"
echo "   2. npm run production  (to start the app)"
echo "   3. Visit: http://$SERVER:2016/"
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment setup complete!"
    echo ""
    echo "📋 To start the application, run:"
    echo "   ssh $ONID@$SERVER"
    echo "   cd ~/$PROJECT_DIR/$APP_DIR"
    echo "   npm run production"
    echo ""
    echo "🌐 Your app will be available at: http://$SERVER:2016/"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

