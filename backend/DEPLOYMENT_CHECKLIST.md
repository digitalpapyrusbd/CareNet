# 🚀 Quick Deployment Checklist

**Use this checklist to ensure smooth deployment**

---

## ✅ **PRE-DEPLOYMENT**

### Code & Build
- [ ] All modules implemented (25/25)
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] All tests pass (if any)
- [ ] Health endpoint added (`/api/health`)

### Database
- [ ] Neon PostgreSQL database exists
- [ ] Database connection string verified
- [ ] `npx prisma migrate deploy` ready
- [ ] Prisma client generated

### Environment Variables
- [ ] JWT secrets generated (use: `openssl rand -base64 32`)
- [ ] Database URL configured
- [ ] Redis URL configured
- [ ] Payment gateway credentials ready (bKash/Nagad)
- [ ] Notification service keys ready (Twilio/SendGrid/FCM)
- [ ] Cloudflare R2 credentials ready

### Security
- [ ] CORS configured for production frontend URL
- [ ] Rate limiting enabled
- [ ] Environment variables encrypted (in Render)

---

## 🚀 **BACKEND DEPLOYMENT (RENDER)**

### Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] New Web Service created
- [ ] Root directory set to `backend`

### Configuration
- [ ] Build command: `npm install && npx prisma generate && npm run build`
- [ ] Start command: `npm run start:prod`
- [ ] Instance type selected (Free or Starter)
- [ ] Region: Singapore (or closest to Bangladesh)

### Environment Variables (All Set)
- [ ] DATABASE_URL
- [ ] REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
- [ ] JWT_SECRET, JWT_REFRESH_SECRET
- [ ] PORT, NODE_ENV, API_PREFIX
- [ ] FRONTEND_URL, CORS_ORIGIN
- [ ] Payment gateway variables (bKash/Nagad)
- [ ] Notification service variables (Twilio/SendGrid/FCM)
- [ ] Cloudflare R2 variables

### Deployment
- [ ] Auto-deploy enabled
- [ ] Health check path: `/api/health`
- [ ] Service deployed successfully
- [ ] Build logs show no errors
- [ ] Service is "Live"

### Verification
- [ ] Health endpoint works: `curl https://your-service.onrender.com/api/health`
- [ ] Database connection successful (check logs)
- [ ] Redis connection successful (check logs)
- [ ] API endpoints accessible

---

## 🌐 **FRONTEND DEPLOYMENT (VERCEL)**

### Setup
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported

### Configuration
- [ ] Framework: Next.js (auto-detected)
- [ ] Root directory: `.` or `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Environment Variables
- [ ] NEXT_PUBLIC_API_URL (backend Render URL)
- [ ] NEXT_PUBLIC_APP_URL (Vercel URL)
- [ ] Other frontend variables

### Deployment
- [ ] Project deployed successfully
- [ ] Build logs show no errors
- [ ] Frontend accessible

### Verification
- [ ] Frontend loads correctly
- [ ] API calls work (check browser console)
- [ ] Authentication flow works
- [ ] No CORS errors

---

## 🔗 **INTEGRATION**

### Backend-Frontend Connection
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend API URL points to backend
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test protected routes

### End-to-End Testing
- [ ] User can register
- [ ] OTP verification works
- [ ] Login works
- [ ] Dashboard loads
- [ ] API calls succeed
- [ ] No console errors

---

## 📊 **POST-DEPLOYMENT**

### Monitoring
- [ ] Render logs monitored
- [ ] Vercel logs monitored
- [ ] Database connection stable
- [ ] Redis connection stable
- [ ] API response times acceptable

### Performance
- [ ] Health endpoint < 100ms
- [ ] Auth endpoints < 500ms
- [ ] Frontend load < 3s
- [ ] No memory leaks

### Security
- [ ] HTTPS enforced (automatic)
- [ ] Secrets not exposed
- [ ] CORS properly configured
- [ ] Rate limiting working

---

## 🎯 **FINAL VERIFICATION**

### Backend
- [ ] ✅ Live on Render
- [ ] ✅ Database connected
- [ ] ✅ Redis connected
- [ ] ✅ Health endpoint working
- [ ] ✅ API endpoints responding

### Frontend
- [ ] ✅ Live on Vercel
- [ ] ✅ Backend API connected
- [ ] ✅ Authentication working
- [ ] ✅ No errors in console

### Integration
- [ ] ✅ End-to-end flow working
- [ ] ✅ Data persistence working
- [ ] ✅ Real-time features working (if applicable)

---

## 📝 **DEPLOYMENT URLS**

**Backend API:**
```
https://your-service-name.onrender.com/api
```

**Frontend:**
```
https://your-project.vercel.app
```

**Health Check:**
```
https://your-service-name.onrender.com/api/health
```

---

## 🆘 **IF SOMETHING GOES WRONG**

1. **Check Logs:**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployments → View Logs

2. **Common Issues:**
   - Database connection: Check DATABASE_URL
   - CORS errors: Update CORS_ORIGIN
   - Build fails: Check build logs
   - 500 errors: Check service logs

3. **Rollback:**
   - Render: Manual Deploy → Previous version
   - Vercel: Deployments → Three dots → Promote to Production

---

**Status:** Ready to deploy! ✅

Follow the checklist above step by step.
