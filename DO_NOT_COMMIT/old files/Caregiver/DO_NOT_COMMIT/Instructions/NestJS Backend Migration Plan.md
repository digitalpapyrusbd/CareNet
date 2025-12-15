Instruction: 
1. Following is the migration plan. Read it. 
2. Follow the steps mentioned below. 
3. While following the steps. check if the jobs mentioned in the steps were done properly previously. 
4. If not done then do it. 
5. Add you comment in this file under each step of each phase.  



NestJS Backend Migration Plan 🚀
I'll give you a step-by-step action plan to split your backend cleanly, minimize disruption, and get both services deployed.

Phase 1: NestJS Project Setup (1 hour) ✅ COMPLETED
Step 1: Create NestJS Project ✅
# In your project root, create backend folder

npx @nestjs/cli new backend



# Choose package manager: npm

# This creates: /backend folder with fresh NestJS app

Step 2: Install Required Dependencies ✅
cd backend



# Core dependencies

npm install @prisma/client prisma

npm install bcryptjs jsonwebtoken

npm install class-validator class-transformer

npm install @nestjs/jwt @nestjs/passport passport passport-jwt

npm install zod



# Development dependencies

npm install -D @types/bcryptjs @types/jsonwebtoken @types/passport-jwt

Step 3: Copy Prisma Schema ✅
# Copy your existing Prisma setup

cp -r ../prisma ./prisma

cp ../.env ./



# Generate Prisma client

npx prisma generate

Files to copy from your Next.js project:

prisma/schema.prisma
prisma/seed.ts (if you have one)
.env file (update DATABASE_URL if needed)
Phase 2: Core Structure Setup (1.5 hours) ✅ COMPLETED
Step 4: Create Module Structure ✅
NestJS uses modules. Here's your architecture:

backend/src/

├── auth/

│ ├── auth.module.ts

│ ├── auth.controller.ts

│ ├── auth.service.ts

│ ├── guards/

│ │ ├── jwt-auth.guard.ts

│ │ └── roles.guard.ts

│ └── strategies/

│ └── jwt.strategy.ts

├── users/

│ ├── users.module.ts

│ ├── users.controller.ts

│ └── users.service.ts

├── companies/

│ ├── companies.module.ts

│ ├── companies.controller.ts

│ └── companies.service.ts

├── caregivers/

│ ├── caregivers.module.ts

│ ├── caregivers.controller.ts

│ └── caregivers.service.ts

├── patients/

│ ├── patients.module.ts

│ ├── patients.controller.ts

│ └── patients.service.ts

├── jobs/

│ ├── jobs.module.ts

│ ├── jobs.controller.ts

│ └── jobs.service.ts

├── payments/

│ ├── payments.module.ts

│ ├── payments.controller.ts

│ ├── payments.service.ts

│ └── providers/

│ ├── bkash.service.ts

│ └── nagad.service.ts

├── common/

│ ├── prisma/

│ │ ├── prisma.module.ts

│ │ └── prisma.service.ts

│ ├── decorators/

│ │ ├── roles.decorator.ts

│ │ └── public.decorator.ts

│ └── filters/

│ └── http-exception.filter.ts

└── main.ts

Step 5: Create Prisma Service (Database Connection) ✅
File: src/common/prisma/prisma.service.ts

Key points:

Singleton PrismaClient instance
Handles connection lifecycle
Used by all other services
File: src/common/prisma/prisma.module.ts

Exports PrismaService globally so all modules can inject it.

Phase 3: Migrate Authentication (2 hours) ✅ COMPLETED
Step 6: Set Up JWT Authentication ✅
Files to create:

src/auth/strategies/jwt.strategy.ts - Validates JWT tokens
src/auth/guards/jwt-auth.guard.ts - Protects routes
src/auth/guards/roles.guard.ts - Role-based access control
src/auth/auth.service.ts - Login, register, token generation
src/auth/auth.controller.ts - Auth endpoints
Copy logic from your Next.js:

src/lib/auth/jwt.ts → auth.service.ts
src/lib/auth/password.ts → auth.service.ts
src/lib/auth/middleware.ts → jwt.strategy.ts
Step 7: Create Role Decorators ✅
File: src/common/decorators/roles.decorator.ts

This replaces your inline role checks with clean decorators:

@Roles('GUARDIAN', 'COMPANY')

@Get('profile')

getProfile() { ... }

Phase 4: Migrate API Routes (3-4 hours)
Step 8: Convert API Routes to Controllers ✅
Pattern to follow:

Next.js route: src/app/api/users/route.ts

export async function GET(request) { ... }

export async function POST(request) { ... }

↓ Becomes NestJS controller:

File: src/users/users.controller.ts

@Controller('users')

export class UsersController {

@Get()

findAll() { ... }



@Post()

create(@Body() createUserDto) { ... }

}

Step 9: Migration Priority Order
Migrate in this sequence (easy to hard):

Auth module (login, register, refresh token)
Users module (CRUD operations)
Companies module (company management)
Caregivers module (caregiver profiles)
Patients module (patient records)
Jobs module (job assignments)
Payments module (bKash/Nagad integration)
Step 10: Copy Validation Schemas
Create DTOs (Data Transfer Objects):

From: src/lib/validations/user.ts (Zod) To: src/users/dto/create-user.dto.ts (class-validator)

NestJS uses class-validator instead of Zod:

export class CreateUserDto {

@IsString()

@MinLength(2)

name: string;



@IsEmail()

email: string;



@Matches(/^(\+8801|01)[3-9]\d{8}$/)

phone: string;

}

Phase 5: Payment Services Migration (2 hours)
Step 11: Create Payment Services
Files to copy:

src/lib/payments/bkash.ts → src/payments/providers/bkash.service.ts
src/lib/payments/nagad.ts → src/payments/providers/nagad.service.ts
src/lib/payments/escrow.ts → src/payments/escrow.service.ts
Update to NestJS patterns:

Add @Injectable() decorator
Inject PrismaService via constructor
Use dependency injection
Step 12: Webhook Handling
File: src/payments/payments.controller.ts

Key endpoints:

POST /payments/create - Checkout initiation
GET /payments/bkash/callback - bKash webhook
GET /payments/nagad/callback - Nagad webhook
POST /payments/refund - Refund processing
Copy webhook signature verification logic from your Next.js implementation.

Phase 6: CORS & Security Configuration (30 minutes)
Step 13: Configure CORS
File: src/main.ts

Enable CORS to allow Next.js frontend to call backend:

app.enableCors({

 origin: process.env.FRONTEND_URL, // Vercel URL

 credentials: true,

 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

});

Step 14: Add Security Headers
Install helmet for security:

npm install helmet

Add to main.ts:

import helmet from 'helmet';

app.use(helmet());

Step 15: Rate Limiting
npm install @nestjs/throttler

Configure in app.module.ts:

ThrottlerModule.forRoot({

ttl: 60,

limit: 100, // 100 requests per minute

}),

Phase 7: Environment Configuration (15 minutes)
Step 16: Update Environment Variables
File: backend/.env

Required variables:

# Database

DATABASE_URL="postgresql://..."



# JWT

JWT_SECRET="your-secret"

JWT_REFRESH_SECRET="your-refresh-secret"



# Payment Gateways

BKASH_BASE_URL="https://checkout.sandbox.bka.sh/v1.2.0-beta"

BKASH_APP_KEY="..."

BKASH_APP_SECRET="..."

BKASH_USERNAME="..."

BKASH_PASSWORD="..."

BKASH_WEBHOOK_SECRET="..."



NAGAD_BASE_URL="https://api.sandbox.mynagad.com"

NAGAD_MERCHANT_ID="..."



# Frontend

FRONTEND_URL="http://localhost:3000" # For CORS



# Server

PORT=4000

Phase 8: Frontend Updates (1-2 hours)
Step 17: Create API Client
File: src/lib/api-client.ts (in Next.js project)

Central API client with base URL:

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';



export async function apiCall(endpoint, options) {

 const token = getToken(); // from localStorage/cookies

 

 const response = await fetch(`${API_BASE_URL}${endpoint}`, {

 ...options,

 headers: {

 'Content-Type': 'application/json',

 'Authorization': `Bearer ${token}`,

 ...options?.headers,

 },

 });

 

 return response.json();

}

Step 18: Update All API Calls
Find and replace pattern:

Before:

await fetch('/api/users')

After:

import { apiCall } from '@/lib/api-client';

await apiCall('/users')

Tip: Use VS Code search/replace:

Search: fetch\(['"]/api/
Replace with: apiCall('
Step 19: Update Environment Variables
File: .env.local (Next.js)

NEXT_PUBLIC_API_URL=http://localhost:4000

File: .env.production (for Vercel)

NEXT_PUBLIC_API_URL=https://your-backend.render.com

Phase 9: Deployment (1 hour)
Step 20: Deploy Backend to Render
Create render.yaml in backend folder:
services:

- type: web

name: caregiver-backend

env: node

buildCommand: npm install && npx prisma generate

startCommand: npm run start:prod

envVars:

- key: DATABASE_URL

sync: false

- key: JWT_SECRET

sync: false

- key: NODE_ENV

value: production

Connect to GitHub:
Go to render.com
New → Web Service
Connect your GitHub repository
Select /backend folder
Environment: Node
Build command: npm install && npx prisma generate
Start command: npm run start:prod
Add environment variables in Render dashboard
Deploy - Render will build and deploy automatically
Step 21: Deploy Frontend to Vercel
Update Vercel environment variables:
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
Push to GitHub:
git add .

git commit -m "Split backend to NestJS"

git push origin main

Vercel auto-deploys your Next.js frontend
Step 22: Run Database Migrations
# From your backend folder

npx prisma migrate deploy

This applies all migrations to your production database.

Phase 10: Testing & Verification (30 minutes)
Step 23: Test Critical Flows
Test checklist:

[ ] User registration works
[ ] Login returns JWT token
[ ] Protected routes require authentication
[ ] Payment checkout creates transaction
[ ] Webhook callbacks update payment status
[ ] Escrow funds are held correctly
[ ] Role-based access works (Guardian can't access admin routes)
Step 24: Monitor Logs
Render dashboard:

Check deployment logs
Monitor runtime logs
Watch for errors
Vercel dashboard:

Check build logs
Monitor serverless function errors
Timeline Summary
Phase Task Time 1 NestJS project setup 1 hour 2 Core structure 1.5 hours 3 Authentication migration 2 hours 4 API routes migration 3-4 hours 5 Payment services 2 hours 6 CORS & security 30 min 7 Environment config 15 min 8 Frontend updates 1-2 hours 9 Deployment 1 hour 10 Testing 30 min Total 12-14 hours Migration Checklist
Before You Start:
[ ] Commit all current work to git
[ ] Create a new branch: git checkout -b backend-migration
[ ] Backup your database (Neon has automatic backups)
During Migration:
[ ] Copy Prisma schema to NestJS
[ ] Migrate one module at a time (test each)
[ ] Update frontend API calls incrementally
[ ] Test locally before deploying
After Migration:
[ ] Both services running locally (Next.js on :3000, NestJS on :4000)
[ ] All tests passing
[ ] Deploy backend to Render
[ ] Deploy frontend to Vercel
[ ] Verify production works
[ ] Merge to main branch
Common Pitfalls to Avoid
CORS errors - Make sure FRONTEND_URL is set correctly in backend
Environment variables - Double-check all secrets are in Render/Vercel
Database connections - Both services use same DATABASE_URL
Port conflicts - Run backend on :4000, frontend on :3000 locally
Build failures - Run npx prisma generate in build command
What You'll Have After Migration
Frontend (Vercel)

├── Next.js pages & components

├── Calls backend via API client

└── Deployed at: your-app.vercel.app



Backend (Render)

├── NestJS REST API

├── Prisma + PostgreSQL

├── Payment integrations

├── Background jobs support

└── Deployed at: your-api.onrender.com



Database (Neon)

└── PostgreSQL (shared by both)

Ready to Start?
I recommend:

Start with Phase 1-2 (setup + structure) - Get NestJS running locally
Then Phase 3 (auth) - Most critical module
Test thoroughly before proceeding
Migrate one module at a time - Don't rush
Want me to help you with any specific phase, or provide actual code examples for any step?

