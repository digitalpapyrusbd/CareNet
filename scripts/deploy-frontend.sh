#!/bin/bash

# CareNet Frontend Deployment Script
# This script helps deploy the frontend to Vercel

set -e

echo "🚀 CareNet Frontend Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if NEXT_PUBLIC_API_URL is set
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo -e "${YELLOW}⚠️  Warning: NEXT_PUBLIC_API_URL is not set${NC}"
    echo "This should be set in Vercel dashboard after deployment"
fi

# Navigate to project root
cd "$(dirname "$0")/.." || exit 1

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔧 Step 2: Type checking..."
npm run type-check || echo -e "${YELLOW}⚠️  Type check warnings (non-blocking)${NC}"

echo ""
echo "🏗️  Step 3: Building application..."
npm run build

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Run: vercel"
echo "3. Configure environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_API_URL (your backend URL)"
echo "4. Deploy to production: vercel --prod"
echo ""
echo "Or use Vercel dashboard to connect your GitHub repository"
