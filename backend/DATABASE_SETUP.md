# Database Setup Instructions

## Credentials Provided

### Neon PostgreSQL (Production)
- **Database:** caregiver_db
- **Connection String:** `postgresql://neondb_owner:npg_FLkcDY4es3bJ@ep-wild-leaf-a1pinkz2-pooler.ap-southeast-1.aws.neon.tech/caregiver_db?sslmode=require`
- **User:** neondb_owner
- **Password:** npg_FLkcDY4es3bJ

### Neon PostgreSQL (Test)
- **Database:** caregiver_test
- **Connection String:** `postgresql://neondb_owner:npg_gIbOCjTxt15K@ep-wild-leaf-a1pinkz2-pooler.ap-southeast-1.aws.neon.tech/caregiver_test?sslmode=require`
- **User:** neondb_owner
- **Password:** npg_c9WQxKsCLU7O

### Upstash Redis
- **Endpoint:** central-maggot-12836.upstash.io
- **Port:** 6379
- **Password/Token:** ATIkAAIncDJiOGZjZGNjNDIxMjY0NzZjYWJmYjNmNTY3OTlkNGZkNXAyMTI4MzY
- **HTTPS URL:** https://central-maggot-12836.upstash.io
- **TCP URL:** rediss://default:ATIkAAIncDJiOGZjZGNjNDIxMjY0NzZjYWJmYjNmNTY3OTlkNGZkNXAyMTI4MzY@central-maggot-12836.upstash.io:6379

---

## Setup Steps

### 1. Update .env File

Copy `.env.example` to `.env` and it already has the correct values:

```bash
cp .env.example .env
```

The file already contains:
- Neon PostgreSQL connection string
- Upstash Redis credentials
- JWT secrets (change in production)
- Placeholder values for payment gateways and notifications

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables in your Neon PostgreSQL database
- Set up all relationships
- Create indexes
- Apply all schema changes

### 4. (Optional) Seed Database

If you have seed data:

```bash
npx prisma db seed
```

### 5. Verify Database Connection

```bash
npx prisma studio
```

This opens Prisma Studio to view your database.

---

## Quick Start Commands

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev

# 4. Start development server
npm run start:dev
```

---

## Database Schema

The migration will create 30+ tables including:
- users
- companies
- caregivers
- patients
- packages
- jobs
- assignments
- payments
- escrows
- invoices
- conversations
- messages
- verification_steps
- subscriptions
- account_lockouts
- notifications
- And more...

---

## Testing Database Connection

To test if the connection works:

```bash
# Using psql
psql 'postgresql://neondb_owner:npg_FLkcDY4es3bJ@ep-wild-leaf-a1pinkz2-pooler.ap-southeast-1.aws.neon.tech/caregiver_db?sslmode=require'

# Or using Prisma
npx prisma db pull
```

---

## Redis Connection Test

To test Redis connection, you can use the Redis CLI or test it when the app starts.

The auth service will use Redis for OTP storage automatically.

---

## Environment Variables

All environment variables are set in `.env`:

**Database:**
- `DATABASE_URL` - Neon PostgreSQL connection string

**Redis:**
- `REDIS_URL` - Full Redis connection string
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port (6379)
- `REDIS_PASSWORD` - Redis password/token

**JWT:**
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens

**App:**
- `PORT` - Application port (4000)
- `NODE_ENV` - Environment (development/production)

---

## Next Steps After Setup

1. Run migrations: `npx prisma migrate dev`
2. Start the server: `npm run start:dev`
3. Test endpoints using Postman/Thunder Client
4. Check Prisma Studio: `npx prisma studio`

---

## Troubleshooting

**Connection Issues:**
- Ensure your IP is whitelisted in Neon dashboard
- Check if SSL mode is required
- Verify connection string is correct

**Migration Issues:**
- Delete `prisma/migrations` folder and run `npx prisma migrate dev` again
- Or use `npx prisma db push` for development

**Redis Issues:**
- Verify Upstash Redis is active
- Check if password/token is correct
- Test connection with Redis CLI

---

**Status:** Ready to run migrations and start the application!
