#!/bin/bash

# CareNet Backend Deployment Script
# This script helps deploy the backend to Render

set -e

echo "🚀 CareNet Backend Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL environment variable is not set${NC}"
    echo "Please set DATABASE_URL before running this script"
    exit 1
fi

echo -e "${GREEN}✓ DATABASE_URL is set${NC}"

# Navigate to backend directory
cd "$(dirname "$0")/../backend" || exit 1

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔧 Step 2: Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Step 3: Running database migrations..."
npx prisma migrate deploy

echo ""
echo "🏗️  Step 4: Building application..."
npm run build

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Render"
echo "3. Configure environment variables in Render dashboard"
echo "4. Deploy!"
echo ""
echo "For detailed instructions, see: backend/DEPLOYMENT_GUIDE.md"
