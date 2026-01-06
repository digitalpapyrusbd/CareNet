#!/bin/bash

# CareNet Full Stack Deployment Script
# This script helps deploy both backend and frontend

set -e

echo "🚀 CareNet Full Stack Deployment"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}Project Root: $PROJECT_ROOT${NC}"
echo ""

# Deploy Backend
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📦 Deploying Backend${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

"$SCRIPT_DIR/deploy-backend.sh"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Deploying Frontend${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

"$SCRIPT_DIR/deploy-frontend.sh"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Full Stack Deployment Preparation Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Backend (Render):"
echo "  [ ] Push code to GitHub"
echo "  [ ] Connect repository to Render"
echo "  [ ] Set environment variables in Render"
echo "  [ ] Deploy service"
echo ""
echo "Frontend (Vercel):"
echo "  [ ] Push code to GitHub"
echo "  [ ] Connect repository to Vercel"
echo "  [ ] Set NEXT_PUBLIC_API_URL in Vercel"
echo "  [ ] Deploy to production"
echo ""
echo "Post-Deployment:"
echo "  [ ] Update backend CORS_ORIGIN with frontend URL"
echo "  [ ] Test authentication flow"
echo "  [ ] Verify API connectivity"
echo "  [ ] Monitor logs for errors"
echo ""
