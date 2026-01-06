# 🚀 Deployment Guide - Caregiver Platform

Complete guide for deploying the Caregiver Platform to production environments.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Option 1: Vercel (Recommended for Frontend)](#option-1-vercel-recommended)
  - [Option 2: Render (Full-Stack)](#option-2-render-full-stack)
  - [Option 3: Custom Server](#option-3-custom-server)
- [Database Migration](#database-migration)
- [Post-Deployment Tasks](#post-deployment-tasks)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

Before deploying, ensure you have completed the following:

### ✅ Code Preparation
- [ ] All tests passing: `npm test`
- [ ] Build succeeds locally: `npm run build`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors in browser

### ✅ Configuration Files
- [ ] `.env.example` reviewed and updated
- [ ] `.gitignore` includes all sensitive files
- [ ] `render.yaml` or deployment config ready
- [ ] `vercel.json` configured (if using Vercel)

### ✅ External Services Setup
- [ ] PostgreSQL database provisioned
- [ ] Redis/Upstash account created
- [ ] SendGrid account configured
- [ ] Twilio account configured
- [ ] Google AI API key obtained
- [ ] Firebase project created (optional)
- [ ] Payment gateway credentials (bKash, Nagad)

### ✅ Security
- [ ] Strong secrets generated for JWT and NextAuth
- [ ] CORS configured for production domain only
- [ ] Environment variables documented
- [ ] No hardcoded credentials in code

---

## 🔧 Environment Setup

### 1. Generate Secure Secrets

Generate strong secrets for production:

```bash
# Generate JWT Secret (32 characters minimum)
openssl rand -base64 32

# Generate NextAuth Secret
openssl rand -base64 32

# Generate Session Secret
openssl rand -base64 32
```

### 2. Database Setup

**Development (SQLite):**
```bash
DATABASE_URL="file:./dev.db"
```

**Production (PostgreSQL):**
```bash
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
```

### 3. Required Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `JWT_SECRET` - JWT secret key
- `UPSTASH_REDIS_REST_URL` - Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis token
- `SENDGRID_API_KEY` - Email service key
- `TWILIO_ACCOUNT_SID` - SMS service SID
- `TWILIO_AUTH_TOKEN` - SMS service token

---

## 🚀 Deployment Options

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Automatic Next.js optimization
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments for PRs
- ✅ Zero-config deployment

### A. Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# Initial deployment (follow prompts)
vercel

# Production deployment
vercel --prod
```

### B. Deploy via Vercel Dashboard

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### Step 2: Import Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings

#### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Required:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=your-secret-here
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=your-token
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@yourdomain.com
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
GOOGLE_API_KEY=AIza...
```

**Optional:**
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account"...}
BKASH_API_KEY=your-key
NAGAD_API_KEY=your-key
```

#### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

#### Step 5: Configure Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

### C. Vercel Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] All environment variables configured
- [ ] Build succeeds on Vercel
- [ ] Database migrations run successfully
- [ ] Custom domain configured (if applicable)
- [ ] NEXTAUTH_URL updated to production URL
- [ ] Test authentication flow
- [ ] Test payment integration
- [ ] Verify email notifications
- [ ] Verify SMS notifications

---

## Option 2: Render (Full-Stack)

### Why Render?
- ✅ Free PostgreSQL database
- ✅ Free Redis instance
- ✅ Simple configuration with `render.yaml`
- ✅ Automatic deployments from Git
- ✅ Built-in SSL certificates

### A. Deploy via render.yaml

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up and verify email

#### Step 2: Push Code to GitHub
```bash
git add .
git commit -m "Add render.yaml configuration"
git push origin main
```

#### Step 3: Create New Blueprint
1. In Render Dashboard, click "New +"
2. Select "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml`

#### Step 4: Review Services
Render will create:
- **Web Service** (Next.js Frontend)
- **PostgreSQL Database** (caregiver-db)
- **Redis Instance** (caregiver-redis)

#### Step 5: Configure Environment Variables

For each service, add these environment variables:

**Frontend Service:**
```
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=[generate via Render]
JWT_SECRET=[generate via Render]
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
GOOGLE_API_KEY=AIza...
BKASH_API_KEY=...
NAGAD_API_KEY=...
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api
```

**Note:** Database and Redis URLs are automatically configured via `render.yaml`.

#### Step 6: Deploy
Click "Apply" to start deployment. First deploy takes 5-10 minutes.

### B. Manual Render Setup (Alternative)

If not using `render.yaml`:

#### Step 1: Create Web Service
1. New + → Web Service
2. Connect repository
3. Configure:
   - **Name:** caregiver-platform
   - **Region:** Singapore (or nearest)
   - **Branch:** main
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** Starter (upgrade as needed)

#### Step 2: Create PostgreSQL Database
1. New + → PostgreSQL
2. Configure:
   - **Name:** caregiver-db
   - **Database:** caregiver_production
   - **Region:** Singapore (same as web service)
   - **Plan:** Starter

#### Step 3: Create Redis Instance
1. New + → Redis
2. Configure:
   - **Name:** caregiver-redis
   - **Region:** Singapore
   - **Plan:** Starter
   - **Max Memory Policy:** allkeys-lru

#### Step 4: Link Services
1. Go to Web Service → Environment
2. Add environment variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Select "caregiver-db" from dropdown
3. Add another:
   - **Key:** `REDIS_URL`
   - **Value:** Select "caregiver-redis" from dropdown

#### Step 5: Add Remaining Environment Variables
Add all required variables from `.env.example`.

### C. Render Deployment Checklist

- [ ] GitHub repository connected
- [ ] Blueprint deployed or services created manually
- [ ] PostgreSQL database provisioned
- [ ] Redis instance provisioned
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Health checks passing
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Test all features in production

---

## Option 3: Custom Server

### Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 22.12.0+
- PostgreSQL 14+
- Redis 6+
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Configure PostgreSQL

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE caregiver_production;
CREATE USER caregiver_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE caregiver_production TO caregiver_user;
\q
```

### Step 3: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/caregiver-platform.git
cd caregiver-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
nano .env.local  # Edit with your values

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Build application
npm run build
```

### Step 4: Configure PM2

```bash
# Start application with PM2
pm2 start npm --name "caregiver-platform" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/caregiver-platform
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/caregiver-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📊 Database Migration

### Initial Migration

After deploying, run migrations to set up database schema:

#### Vercel/Render:
```bash
# SSH into your service or use web console
npm run db:generate
npm run db:migrate
```

#### Using Prisma Studio:
```bash
npm run db:studio
```

### Migration Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Reset database (CAUTION: deletes all data)
npm run db:reset

# Seed database with initial data
npm run db:seed
```

---

## ✅ Post-Deployment Tasks

### 1. Verify Deployment

- [ ] Visit production URL and ensure site loads
- [ ] Test user registration
- [ ] Test login flow
- [ ] Test MFA authentication
- [ ] Verify email notifications work
- [ ] Verify SMS notifications work
- [ ] Test payment gateway integration
- [ ] Check all role dashboards (admin, caregiver, guardian, etc.)
- [ ] Test mobile responsiveness
- [ ] Verify PWA installation works

### 2. Configure Monitoring

#### A. Setup Error Tracking (Sentry)

1. Create account at [sentry.io](https://sentry.io)
2. Create new project for Next.js
3. Add environment variable:
   ```
   SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

#### B. Setup Analytics (Google Analytics)

1. Create GA4 property
2. Add environment variable:
   ```
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

#### C. Setup Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### 3. Setup Backups

#### Database Backups (PostgreSQL)

**Render:** Automatic daily backups included

**Vercel:** Configure external PostgreSQL with backups

**Custom Server:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump caregiver_production > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

### 4. Configure CDN (Optional)

For better performance with static assets:

1. **Cloudflare** (Free):
   - Add your domain to Cloudflare
   - Update nameservers
   - Enable CDN and caching

2. **Vercel** (Built-in):
   - Automatic CDN for all deployments

3. **AWS CloudFront** (Advanced):
   - Create CloudFront distribution
   - Point to your origin server
   - Configure caching rules

---

## 📈 Monitoring & Maintenance

### Performance Monitoring

#### Key Metrics to Track:
- Response time
- Error rate
- Database query performance
- API endpoint latency
- User session duration

#### Tools:
- **Vercel Analytics** (built-in)
- **Google Analytics**
- **Sentry Performance Monitoring**
- **New Relic**
- **Datadog**

### Health Checks

Create a health check endpoint (already included):

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

### Log Monitoring

#### Vercel:
- View logs in Vercel Dashboard → Deployments → Logs

#### Render:
- View logs in Render Dashboard → Service → Logs

#### Custom Server:
```bash
# View PM2 logs
pm2 logs caregiver-platform

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Regular Maintenance Tasks

**Daily:**
- [ ] Check error logs
- [ ] Monitor uptime alerts
- [ ] Review critical errors in Sentry

**Weekly:**
- [ ] Review performance metrics
- [ ] Check database size and growth
- [ ] Review user feedback and support tickets

**Monthly:**
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Review and rotate API keys
- [ ] Database performance optimization
- [ ] Review and clean up old logs

**Quarterly:**
- [ ] Review and update secrets
- [ ] Conduct security audit
- [ ] Review and optimize infrastructure costs
- [ ] Load testing
- [ ] Disaster recovery drill

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Fails on Deployment

**Issue:** Build fails with TypeScript errors

**Solution:**
```bash
# Locally test the build
npm run build

# If it works locally but fails in production, check:
# - Node version matches (22.12.0+)
# - All dependencies installed
# - TypeScript errors can be temporarily ignored with:
typescript: {
  ignoreBuildErrors: true
}
```

#### 2. Database Connection Errors

**Issue:** Cannot connect to database

**Solution:**
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Verify network/firewall rules allow connections
- Check PostgreSQL logs for errors

```bash
# Test database connection
npm run db:studio
```

#### 3. Environment Variables Not Working

**Issue:** Features not working due to missing env vars

**Solution:**
- Verify all variables are set in deployment platform
- Restart service after adding variables
- Check variable names match exactly (case-sensitive)
- For `NEXT_PUBLIC_*` vars, rebuild is required

#### 4. Redis Connection Timeout

**Issue:** Rate limiting or caching not working

**Solution:**
- Verify Redis instance is running
- Check `UPSTASH_REDIS_REST_URL` and token
- Verify network connectivity to Redis
- Check Redis memory limits

#### 5. Email/SMS Not Sending

**Issue:** Notifications not being delivered

**Solution:**
- Verify API keys are correct
- Check service account has credits
- Review service provider logs
- Test with service provider's test tools
- Verify `FROM_EMAIL` is verified in SendGrid

#### 6. Payment Gateway Errors

**Issue:** bKash or Nagad payments failing

**Solution:**
- Verify API credentials are correct
- Check if using correct environment (sandbox vs production)
- Review payment gateway logs
- Ensure callback URLs are whitelisted
- Test with small amounts first

### Getting Help

**Resources:**
- GitHub Issues: [github.com/yourrepo/issues](https://github.com)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma Docs: [prisma.io/docs](https://prisma.io/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Render Support: [render.com/docs](https://render.com/docs)

**Community:**
- Next.js Discord
- Reddit: r/nextjs
- Stack Overflow: [tag: next.js]

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use strong, random secrets (32+ characters)
- Rotate secrets every 90 days
- Use secret management services in production

### 2. Database Security
- Use SSL for database connections
- Restrict database access to application servers only
- Regular backups with encryption
- Strong passwords (20+ characters)

### 3. API Security
- Rate limiting enabled (via Upstash Redis)
- CORS restricted to production domain
- Input validation on all endpoints
- SQL injection prevention (Prisma)

### 4. Authentication
- Strong password requirements enforced
- MFA enabled for admin accounts
- Session timeout configured
- JWT tokens expire appropriately

### 5. Network Security
- HTTPS enforced (SSL/TLS)
- Security headers configured (see `next.config.js`)
- CSRF protection enabled
- XSS prevention measures

---

## 📞 Support & Contact

For deployment assistance:
- Email: support@caregiverbd.com
- GitHub Issues: [Create an issue](https://github.com/yourrepo/issues/new)
- Documentation: [README.md](./README.md)

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- ✅ Vercel deployment support
- ✅ Render blueprint configuration
- ✅ Custom server deployment guide
- ✅ Complete environment variable documentation
- ✅ Database migration guides
- ✅ Monitoring and maintenance procedures

---

**Last Updated:** January 2025  
**Maintainers:** Caregiver Platform Team  
**License:** MIT