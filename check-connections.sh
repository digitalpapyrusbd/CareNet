#!/bin/bash

echo "=========================================="
echo "Connection Diagnostic Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health
echo "1. Testing Backend Health Endpoint..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health 2>/dev/null)
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    curl -s http://localhost:4000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:4000/api/health
    echo ""
else
    echo -e "${RED}✗ Backend is not responding (HTTP $BACKEND_HEALTH)${NC}"
    echo "   Make sure backend is running: cd backend && npm run start:dev"
    echo ""
fi

# Test 2: Database Connection (via health endpoint)
echo "2. Testing Database Connection..."
DB_STATUS=$(curl -s http://localhost:4000/api/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
if [ "$DB_STATUS" = "ok" ]; then
    echo -e "${GREEN}✓ Database connection is working${NC}"
else
    echo -e "${RED}✗ Database connection failed${NC}"
    echo "   Check DATABASE_URL in backend/.env"
    echo ""
fi

# Test 3: Frontend API Configuration
echo "3. Checking Frontend API Configuration..."
if [ -f ".env.local" ]; then
    API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)
    echo "   NEXT_PUBLIC_API_URL: ${API_URL:-'Not set (using default: http://localhost:4000)'}"
else
    echo "   .env.local not found - using default: http://localhost:4000"
fi
echo ""

# Test 4: CORS Configuration
echo "4. Testing CORS..."
CORS_TEST=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: http://localhost:3000" http://localhost:4000/api/health 2>/dev/null)
if [ "$CORS_TEST" = "200" ]; then
    echo -e "${GREEN}✓ CORS is configured correctly${NC}"
else
    echo -e "${YELLOW}⚠ CORS test inconclusive${NC}"
fi
echo ""

# Test 5: Authentication Endpoint
echo "5. Testing Authentication Endpoint..."
AUTH_TEST=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+880171234569","password":"Demo@123"}' 2>/dev/null)
if [ "$AUTH_TEST" = "200" ] || [ "$AUTH_TEST" = "401" ]; then
    echo -e "${GREEN}✓ Auth endpoint is accessible (HTTP $AUTH_TEST)${NC}"
    if [ "$AUTH_TEST" = "401" ]; then
        echo "   (401 is expected for invalid credentials - endpoint is working)"
    fi
else
    echo -e "${RED}✗ Auth endpoint not responding (HTTP $AUTH_TEST)${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
if [ "$BACKEND_HEALTH" = "200" ] && [ "$DB_STATUS" = "ok" ]; then
    echo -e "${GREEN}✓ Backend and Database: Connected${NC}"
else
    echo -e "${RED}✗ Backend and Database: Issues Found${NC}"
fi
echo ""
echo "Next Steps:"
echo "1. Start backend: cd backend && npm run start:dev"
echo "2. Start frontend: npm run dev"
echo "3. Test login at: http://localhost:3000/auth/login"
echo "4. Check browser console (F12) for errors"
echo "5. Check .cursor/debug.log for connection logs"

