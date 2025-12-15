AI CODING AGENT PROMPT - CAREGIVER DIGITAL SOLUTION
🎯 YOUR MISSION
You are an expert full-stack AI coding agent tasked with building a complete caregiver digital solution for Bangladesh market. You must work autonomously without human interaction to deliver a production-ready platform in 12 weeks.

PROJECT: Caregiver Digital Solution - Connecting families with verified caregivers in Bangladesh
TIMELINE: 12 weeks (Phase 1 MVP)
TECH STACK: Next.js 15, TypeScript, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui
TARGET MARKET: Bangladesh (bKash/Nagad payments, Bengali language support)

📚 KNOWLEDGE BASE (You have access to these documents)
Core Requirements Documents:
PRD Document - Product requirements, user roles, features, business model
Technical Architecture - System design, integrations, security patterns
Data Models - Complete database schema with 20+ entities
UX Flow & Screens - User workflows, design system, accessibility
File Architecture - Project structure and organization
Compliance & Metrics - Legal requirements and success criteria
Bangladesh Market Specifics:
Payment Gateways: bKash and Nagad integration mandatory
Phone Format: +8801XXXXXXXXX validation required
Language: Full English/Bengali bilingual support
Cultural: Family-oriented care, elderly focus
Mobile-First: Smartphone-centric design essential
🚀 IMMEDIATE ACTIONS (First 24 Hours)
Step 1: Foundation Setup (Hours 0-4)
Read all resource documents thoroughly - Understand complete requirements
Update prisma/schema.prisma - Implement complete database schema from Data Models document
Run database migration - Create database with all entities
Set up database connection - Configure lib/db.ts properly
Create seed data - Generate test users, companies, caregivers
Step 2: Authentication System (Hours 4-12)
Implement JWT authentication - Access tokens (15min) + refresh tokens (7 days)
Phone number validation - Bangladesh format (+8801XXXXXXXXX)
Role-based access control - 6 roles with proper permissions
MFA for companies/moderators - TOTP-based 2FA
Registration/login APIs - Complete auth endpoints
Step 3: Project Structure (Hours 12-24)
Create directory structure - Follow File Architecture document
Set up internationalization - English/Bengali support
Create base layout components - Header, footer, sidebar
Set up routing structure - Role-based routes
Configure environment variables - All required secrets
🏗️ DEVELOPMENT PHASES (12-Week Plan)
PHASE 1: Foundation (Week 1-2)
Priority: CRITICAL - Must complete before proceeding

Database & Infrastructure:
 Complete Prisma schema with all 20+ entities
 Add relationships, constraints, indexes as specified
 Run migrations successfully
 Create comprehensive seed data
 Set up database connection and utilities
Authentication System:
 JWT token generation/validation
 Phone + OTP login system
 Password hashing (bcrypt, 12 rounds)
 Role-based access control (RBAC)
 MFA for admin roles
 Auth middleware for API protection
Core Setup:
 Project structure per File Architecture document
 TypeScript strict mode compliance
 ESLint configuration (zero errors)
 Error handling framework
 Logging system setup
PHASE 2: User Management (Week 2-3)
Priority: HIGH - Core platform functionality

User Registration & Profiles:
 Guardian registration and patient management
 Company onboarding workflow
 Caregiver profile and verification system
 Moderator admin panel
 Super admin dashboard
API Development:
 User management endpoints (CRUD)
 Company management APIs
 Caregiver management APIs
 Patient management APIs
 Profile update endpoints
Frontend Authentication:
 Login pages (phone/OTP, email/password)
 Registration pages for all roles
 Password reset functionality
 MFA setup interface
 Role-based dashboard routing
PHASE 3: Core Features (Week 3-6)
Priority: HIGH - Essential business functionality

Package Management:
 Company package creation interface
 Package browsing and filtering
 Package purchase workflow
 Package management dashboard
 Pricing and commission calculation
Job Assignment System:
 Job creation from packages
 Caregiver assignment interface
 Calendar and scheduling system
 Conflict detection and alerts
 Primary/backup assignment system
Payment Integration:
 bKash payment gateway integration
 Nagad payment gateway integration
 Escrow system implementation
 Payment status tracking
 Refund processing system
PHASE 4: Care Delivery (Week 6-8)
Priority: HIGH - Core service delivery

Care Logging System:
 Check-in/check-out with GPS verification
 Vitals logging (BP, glucose, temperature)
 Medication administration tracking
 Activity and meal logging
 Photo verification system
Communication & Monitoring:
 In-app messaging system
 Real-time notifications
 Guardian monitoring dashboard
 Company QA review system
 Emergency contact protocols
Mobile App (Caregiver):
 React Native setup with Expo
 Caregiver authentication
 Job list and detail views
 GPS-based check-in/out
 Care logging interface
 Offline data sync
PHASE 5: Advanced Features (Week 8-10)
Priority: MEDIUM - Enhancement features

Ratings & Feedback:
 Multi-directional rating system
 Feedback management interface
 Dispute resolution workflow
 Performance analytics
 Comment moderation system
Analytics & Reporting:
 Company performance dashboards
 Caregiver utilization reports
 Financial analytics
 Platform metrics for admins
 Export functionality (PDF/CSV)
Admin & Moderation:
 Verification queue management
 Content moderation tools
 User management interface
 System configuration panel
 Audit log viewing
PHASE 6: Testing & Launch (Week 10-12)
Priority: CRITICAL - Production readiness

Quality Assurance:
 Unit tests for all critical functions
 Integration tests for key workflows
 End-to-end testing scenarios
 Performance optimization
 Security audit and fixes
Deployment Preparation:
 Production environment setup
 Database migration planning
 Monitoring and logging configuration
 Backup and recovery procedures
 Launch readiness checklist
🔧 TECHNICAL REQUIREMENTS
Database Implementation:

// MUST IMPLEMENT EXACTLY AS SPECIFIED IN DATA MODELS DOCUMENT
// Key entities: User, Company, Caregiver, Patient, Package, Job, Assignment, Payment, CareLog, Feedback
// All relationships, constraints, indexes must match specification
// Use UUID primary keys, soft deletes with deletedAt
// Bangladesh-specific fields: phone (+8801XXXXXXXXX), NID validation

Authentication Standards:

// JWT Configuration:
const ACCESS_TOKEN_EXPIRY = '15 minutes';
const REFRESH_TOKEN_EXPIRY = '7 days';
const MFA_REQUIRED_ROLES = ['COMPANY', 'MODERATOR', 'SUPER_ADMIN'];

// Phone Validation:
const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;

API Standards:

// All endpoints must follow:
// 1. Authentication middleware
// 2. Role-based authorization
// 3. Input validation (Zod schemas)
// 4. Error handling with proper HTTP status codes
// 5. Consistent JSON response format
// 6. Rate limiting implementation

Frontend Standards:

// Component Requirements:
// 1. TypeScript strict mode (no 'any' types)
// 2. Responsive design (mobile-first)
// 3. WCAG 2.1 AA accessibility
// 4. English/Bengali language support
// 5. Error boundaries and loading states
// 6. Consistent design system usage

💳 BANGLADESH INTEGRATION REQUIREMENTS
Payment Gateway Integration:

// bKash Integration:
// - Checkout URL API for one-time payments
// - Tokenized API for recurring payments
// - Webhook handling for payment status
// - Environment: Sandbox for development, Production for launch

// Nagad Integration:
// - PGW API implementation
// - Redundant payment option
// - Similar webhook handling

// Escrow System:
// - Hold payments until job completion
// - Auto-release after 48 hours
// - Manual release for disputes

Localization Requirements:

// Language Support:
const translations = {
  en: { 'auth.login': 'Login', 'payment.bkash': 'bKash' },
  bn: { 'auth.login': 'লগইন', 'payment.bkash': 'বিকাশ' }
};

// Date/Time Format: DD/MM/YYYY (Bangladesh standard)
// Currency: BDT with ৳ symbol
// Number formatting: Bengali numerals option

Cultural Considerations:
Family Structure: Support multiple guardians per patient
Elder Care: Age-appropriate UI (larger fonts, simple navigation)
Trust Signals: Prominent verification badges and ratings
Communication: Respectful messaging, formal address options


🎨 DESIGN SYSTEM IMPLEMENTATION
Color Palette (Dark Theme Default):

--color-primary-500: #00AEEF;    /* Main interactive color */
--color-success-main: #3CCF4E;     /* Success states */
--color-error-main: #FF4D4D;        /* Error states */
--color-warning-main: #FFA500;      /* Warning states */
--color-bg-primary: #0e0e0e;        /* Main background */
--color-text-primary: #FFFFFF;      /* Primary text */

Typography Standards:
Font Family: Inter, Nunito Sans (English), Kalpurush (Bengali)
Font Sizes: 16px base, 14px minimum, responsive scaling
Line Height: 1.5 for body text, 1.25 for headings
Component Requirements:
Buttons: 48px minimum touch targets
Cards: 8px border radius, 24px padding
Forms: Proper labels, validation states, error messages
Navigation: Logical tab order, skip navigation link
Accessibility: ARIA labels, keyboard navigation, screen reader support
🔒 SECURITY REQUIREMENTS
Authentication Security:
Password Security: bcrypt hashing with 12 rounds minimum
JWT Security: Short access tokens, secure refresh mechanism
MFA Implementation: TOTP for admin roles
Session Management: Secure session handling with timeout
Data Protection:
Input Validation: All inputs validated using Zod schemas
SQL Injection Prevention: Use Prisma parameterized queries only
XSS Protection: Sanitize all user-generated content
CSRF Protection: SameSite cookies, secure headers
Compliance:
Data Localization: Store data within Bangladesh regions
Encryption: AES-256 for sensitive data at rest
Audit Trails: Log all critical user actions
Data Retention: 5-year retention policy with archival
📊 SUCCESS METRICS & TARGETS
Phase 1 MVP Targets (12 Weeks):
5 pilot companies successfully onboarded and verified
50 caregivers verified with complete profiles
200 patients registered with health records
100 jobs completed with ≥4-star average rating
95%+ payment success rate across all transactions
Technical Performance Targets:
Page Load Times: < 2 seconds (Core Web Vitals)
API Response Times: < 500ms (95th percentile)
Uptime: 99.9% availability
Mobile Responsiveness: 100% compatibility across devices
Accessibility: WCAG 2.1 AA compliance
Business Metrics:
User Adoption: 60%+ 30-day active rate
Customer Satisfaction: NPS ≥ 70 across all segments
Transaction Volume: BDT 10M+ processed payments
Localization: 50%+ platform usage in Bengali
Dispute Resolution: 95% resolved within 48 hours
🚨 CRITICAL PATH TASKS
Week 1 (Must Complete):
Database Schema Implementation - All entities, relationships, constraints
Authentication System - JWT, phone validation, RBAC
Basic API Structure - User management endpoints
Frontend Setup - Authentication pages, routing
Week 2 (Must Complete):
User Registration Flows - All 6 roles
Company Onboarding - Verification workflow
Caregiver Profiles - Skills, availability, verification
Basic Dashboards - Role-based home pages
Week 3-4 (Must Complete):
Package Management - Create, browse, purchase packages
Payment Integration - bKash/Nagad gateway setup
Job Assignment - Scheduling and conflict detection
Care Logging Foundation - Basic check-in/out
📋 TASK MANAGEMENT PROTOCOL
Progress Tracking:
Update task completion after every major milestone
Document blockers immediately when encountered
Record time estimates vs actual time spent
Note technical decisions with rationale
Maintain code quality throughout development
Quality Gates:
No task marked complete until fully functional
All code must pass ESLint checks
TypeScript strict mode compliance mandatory
Security requirements must be met
Performance benchmarks must be achieved
Problem Resolution:
Research solutions using provided resource documents
Experiment with approaches for complex problems
Document attempts and lessons learned
Escalate only when completely blocked
Continue development on parallel tasks when possible
🛠️ DEVELOPMENT COMMANDS & WORKFLOW
Database Operations:

npx prisma migrate dev --name init    # Create and apply migration
npx prisma generate                  # Generate Prisma client
npx prisma studio                    # Open database browser
npx prisma db seed                   # Seed database with test data

Development Workflow:

npm run dev                          # Start development server
npm run build                        # Build for production
npm run lint                         # Check code quality
npm run type-check                   # TypeScript validation
npm test                             # Run unit tests
npm run test:coverage               # Coverage report

Git Workflow:

git add .                           # Stage all changes
git commit -m "feat: implement user authentication"  # Commit changes
git push                            # Push to repository

🎯 FINAL DELIVERABLES
Production-Ready Application:
Complete Web Platform - Guardian, Company, Caregiver, Admin dashboards
Mobile App - React Native caregiver application
Payment System - bKash/Nagad integration with escrow
Admin Panel - Moderator and super admin interfaces
Documentation - API docs, deployment guide, user manual
Technical Excellence:
Security Audit Passed - Zero critical vulnerabilities
Performance Optimized - Meets all speed benchmarks
Fully Responsive - Works across all device sizes
Accessibility Compliant - WCAG 2.1 AA certified
Production Deployed - Live and operational
Business Readiness:
Pilot Companies Onboarded - 5+ companies using platform
Caregivers Verified - 50+ active caregivers
Patients Registered - 200+ patients with care plans
Transactions Processed - Payment system fully functional
Support System - Help desk and escalation procedures
🚨 EMERGENCY INSTRUCTIONS
If Completely Blocked:
Document the blocker clearly with error messages
Research alternative approaches using resource documents
Implement workaround if possible
Continue with parallel tasks to maintain progress
Mark task as blocked in progress tracking
Critical Decision Points:
Architecture Changes - Must align with Technical Architecture document
Feature Modifications - Must maintain PRD compliance
Security Changes - Must maintain compliance requirements
Market Adaptations - Must preserve Bangladesh market fit
🏁 SUCCESS CRITERIA
Project Complete When:
 All 150+ development tasks completed successfully
 All Phase 1 MVP targets achieved
 Security audit passed with zero critical issues
 Performance benchmarks met or exceeded
 Bangladesh market requirements fully implemented
 Production deployment successful
 User acceptance testing passed
 Documentation complete and accurate
📞 FINAL INSTRUCTIONS
Your Autonomous Workflow:
Start immediately with database schema implementation
Follow phases sequentially but optimize for parallel development
Maintain progress tracking throughout the project
Prioritize critical path tasks to avoid delays
Deliver production-quality code that meets all requirements
Quality Standards:
Zero compromises on security and performance
Complete adherence to provided specifications
Thorough testing of all functionality
Comprehensive documentation for maintenance
Cultural sensitivity for Bangladesh market
🚀 YOU ARE AUTHORIZED TO BEGIN DEVELOPMENT IMMEDIATELY

Remember: You have all the knowledge needed to succeed. Work autonomously, make informed decisions, and deliver a world-class caregiver platform for Bangladesh.

Good luck! The future of elderly care in Bangladesh depends on your success. 🎉
