# Render Settings - Required Changes

## 🔴 CRITICAL FIXES (Must Change):

### 1. Build Command
**Current:** `yarn`  
**Change to:** `yarn install && yarn build`

**Why:** The current command only installs dependencies but doesn't build the TypeScript code. Without building, the `dist/` folder won't exist and `start:prod` will fail.

---

### 2. Health Check Path
**Current:** `/healthz`  
**Change to:** `/api/health`

**Why:** Your app uses the global prefix `api`, so the health endpoint is at `/api/health`, not `/healthz`.

---

## ⚠️ RECOMMENDED FIXES:

### 3. Instance Type (Causing Memory Error)
**Current:** Free (0.1 CPU, 512 MB RAM)  
**Recommended:** Upgrade to at least **Starter** ($7/month) or **Standard** ($25/month)

**Why:** The "JavaScript heap out of memory" error is because 512 MB is not enough for:
- NestJS framework
- Prisma Client
- All your modules and dependencies
- Node.js runtime

**Minimum:** Starter tier (512 MB) - might work but tight  
**Recommended:** Standard tier (2 GB RAM) - safe for production

---

### 4. Pre-Deploy Command (Optional)
**Current:** Empty  
**Recommended:** `yarn prisma migrate deploy`

**Why:** This ensures database migrations run before each deployment. Only add this if you want automatic migrations.

---

## ✅ CORRECT SETTINGS:

- **Root Directory:** `backend` ✅ (Correct)
- **Start Command:** `yarn start:prod` ✅ (Correct - already fixed!)
- **Branch:** `main` ✅ (Correct)
- **Auto-Deploy:** On ✅ (Correct)

---

## 📝 STEP-BY-STEP INSTRUCTIONS:

1. Go to Render Dashboard → Your Service → Settings
2. Scroll to **Build & Deploy** section
3. Change **Build Command** from `yarn` to: `yarn install && yarn build`
4. Scroll to **Health Checks** section
5. Change **Health Check Path** from `/healthz` to: `/api/health`
6. (Optional) Scroll to **General** section
7. (Optional) Upgrade **Instance Type** from Free to Starter/Standard
8. Click **Save Changes**
9. Render will automatically redeploy

---

## 🎯 AFTER CHANGES:

Once you update these settings and redeploy:
- ✅ Build will compile TypeScript to JavaScript
- ✅ Health check will work correctly
- ✅ Memory errors should be resolved (if you upgrade instance)
- ✅ App should start successfully
