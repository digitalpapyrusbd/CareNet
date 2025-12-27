# Vercel + Render Deployment Fixes Summary

**Date:** January 2025  
**Status:** Ready for Deployment  
**Project:** CareNet Platform

---

## 🚨 **Critical Issues Found**

### Issue #1: API URL Configuration ❌
**Problem:** Frontend was calling Next.js API routes (`localhost:4000`) instead of Render backend

**Fix Applied:**
- Updated `src/lib/api-client.ts`: Changed default `API_BASE_URL` from `http://localhost:4000` to `""` (same origin)
- Frontend will use environment variable `NEXT_PUBLIC_API_URL` to connect to Render backend

---

### Issue #2: Redis Configuration Mismatch ❌
**Problem:** Backend expected `REDIS_HOST/PORT/PASSWORD` but Render had `UPSTASH_REDIS_URL/TOKEN`

**Fix Applied:**
- Updated `backend/src/auth/auth.service.ts` to support both Upstash Redis and standard Redis
- Added TLS configuration for production
- Added retry strategy for better reliability

---

### Issue #3: Token Naming Convention ❌
**Problem:** Backend used snake_case (`access_token`, `refresh_token`) while frontend expected camelCase

**Fix Applied:**
- Updated backend to return camelCase tokens: `accessToken`, `refreshToken`, `requiresMFA`, `tempToken`
- Updated frontend to expect camelCase (already done)

---

## ✅ **Required Environment Variables**

### Vercel Environment Variables (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://carenet-backend-3ibc.onrender.com
```

### Render Environment Variables (Backend)
```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_c9WQxKsCLU7O@ep-wild-leaf-a1pinkz2-pooler.ap-southeast-1.aws.neon.tech/caregiver_db?sslmode=require

# JWT Configuration
JWT_SECRET=7k9mP2xQ8nR5tY1wE6aS4dF3gH0jK9lZ8xC7vB6nM5qW4eR3tY2uI1oP0aS9dF8g
JWT_REFRESH_SECRET=3nB6vC9xZ2aS5dF8gH1jK4lO7iU0yT3rE6wQ9pA2sD5fG8hJ1kL4zX7cV0bN3mQ6
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (Upstash)
UPSTASH_REDIS_TOKEN=ATIkAAIncDJiOGZjZGNjNDIxMjY0NzZjYWJmYjNmNTY3OTlkNGZkNXAyMTI4MzY
UPSTASH_REDIS_URL=https://central-maggot-12836.upstash.io

# CORS
CORS_ORIGINS=https://care-net-five.vercel.app,https://carenet-backend-3ibc.onrender.com

# Node Environment
NODE_ENV=production
```

---

## 🚀 **Deployment Steps**

### Step 1: Update Vercel Environment Variables
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL=https://carenet-backend-3ibc.onrender.com`
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

### Step 2: Update Render Environment Variables
1. Go to Render Dashboard → CareNet Backend → Environment
2. Add/Update `CORS_ORIGINS=https://care-net-five.vercel.app,https://carenet-backend-3ibc.onrender.com`
3. Ensure all variables from the list above are present
4. Deploy changes

### Step 3: Verify Deployment
```bash
# Test backend health
curl https://carenet-backend-3ibc.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","service":"CareNet Backend API","version":"1.0.0"}
```

---

## 📊 **Architecture Overview**

```
┌─────────────────────────────────────────┐
│     Vercel Frontend                    │
│  https://care-net-five.vercel.app       │
│                                         │
│  - Next.js Pages                        │
│  - React Components                     │
│  - API Client (configured via env)     │
└──────────────┬──────────────────────────┘
               │
               │ Calls via NEXT_PUBLIC_API_URL
               │
               ↓
┌─────────────────────────────────────────┐
│     Render Backend                     │
│  https://carenet-backend-3ibc.onrender.com │
│                                         │
│  - NestJS API Routes                   │
│  - PostgreSQL (Neon)                   │
│  - Redis (Upstash)                     │
│  - JWT Auth                            │
└─────────────────────────────────────────┘
```

---

## 🔍 **Testing Checklist**

### Pre-Deployment Testing
- [ ] Backend health endpoint responds correctly
- [ ] CORS allows requests from Vercel domain
- [ ] Redis connection successful
- [ ] Database connection successful

### Post-Deployment Testing
- [ ] Visit https://care-net-five.vercel.app
- [ ] Try to register a new user
- [ ] Try to login with existing credentials
- [ ] Verify tokens are stored in localStorage
- [ ] Check browser console for errors
- [ ] Test role-based redirects (guardian, caregiver, admin)

---

## 🛠️ **Modified Files**

### Frontend Changes
1. `src/lib/api-client.ts` - Updated API_BASE_URL default
2. `src/app/auth/login/page.tsx` - Updated token handling (camelCase)

### Backend Changes
1. `backend/src/auth/auth.service.ts` - Fixed Redis configuration and token naming

---

## 📝 **Notes**

1. **Redis Connection**: The backend now supports both Upstash Redis (via URL + token) and standard Redis (via host + port + password). This makes it more flexible for different deployment environments.

2. **CORS Configuration**: It's critical to include both the frontend and backend URLs in CORS_ORIGINS to prevent CORS errors.

3. **Token Format**: Both frontend and backend now use camelCase consistently (accessToken, refreshToken, requiresMFA, tempToken) to avoid confusion.

4. **Environment Variables**: Never commit `.env` files to git. Use platform-specific secret management (Vercel/Render environment variables).

---

## 🆘 **Troubleshooting**

### Issue: "CORS error" in browser
**Solution**: Check Render `CORS_ORIGINS` includes Vercel URL

### Issue: "Network error: Failed to fetch"
**Solution**: 
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Check Render backend is running and accessible
- Test with curl: `curl https://carenet-backend-3ibc.onrender.com/api/health`

### Issue: "Invalid credentials" even with correct password
**Solution**: 
- Check user exists in database
- Verify `is_active` field is true
- Check password hash format (bcrypt)

### Issue: Redis connection fails
**Solution**:
- Verify `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN` are correct
- Check Upstash dashboard for connection logs
- Test with redis-cli or similar tool

---

## 📞 **Support**

For deployment issues:
1. Check Render and Vercel logs
2. Review browser console errors
3. Verify all environment variables are set correctly
4. Test endpoints with curl or Postman

---

**Deployment Status**: ✅ Ready for production deployment
**Last Updated**: January 2025