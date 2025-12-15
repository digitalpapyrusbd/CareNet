AI Agent Operation Manual - Caregiver Digital Solution
Document Version: 1.0
Created: January 17, 2025
Purpose: Enable autonomous AI agent to build complete caregiver solution without human interaction
Target Technology Stack: Next.js 15, TypeScript, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui

📋 EXECUTIVE SUMMARY
This manual provides comprehensive instructions for an AI coding agent to autonomously build a complete caregiver digital solution for the Bangladesh market. The agent will follow a structured approach using provided resource documents and maintain real-time progress tracking.

🎯 Primary Objectives
Build a production-ready caregiver platform following Phase 1 MVP requirements
Implement all user roles: Guardian, Company, Caregiver, Moderator, Super Admin
Ensure compliance with Bangladesh market requirements (bKash/Nagad payments, bilingual support)
Follow technical architecture specifications and data models exactly
Maintain progress tracking through automated checklists
📚 RESOURCE DOCUMENTS INVENTORY
Core Reference Documents
PRD Document (01_PRD_CaregiverSolution.md)
Product requirements, user roles, features, business model
Target metrics and success criteria
Phase 1 MVP scope definition
Technical Architecture (02_Technical_Architecture.md)
Frontend: Next.js 14+, React Native for mobile
Backend: NestJS recommended, PostgreSQL, Redis
Integration patterns for bKash/Nagad, Twilio, Firebase
Security and deployment specifications
Data Models (03_Data_Model.md)
Complete database schema with 20+ entities
Relationships, constraints, indexes
JSONB schemas for flexible fields
Business rules and triggers
UX Flow & Screens (04_UX_Flow_%26_Screens.md)
Complete user workflows for all roles
Screen transition diagrams
Design system (colors, typography, components)
Accessibility requirements (WCAG 2.1 AA)
File Architecture (05_File_Architecture.md)
Directory structure for web, mobile, and backend
Component organization patterns
Naming conventions
Compliance & Metrics (06_Compliance_%26_Metrics.md)
Legal requirements for Bangladesh
Data privacy and security standards
Success metrics and KPIs
🏗️ PROJECT STRUCTURE REQUIREMENTS
Current Project Setup
Framework: Next.js 15 with App Router (already initialized)
Database: Prisma with SQLite (for development), PostgreSQL for production
UI: shadcn/ui components (already installed)
Styling: Tailwind CSS (already configured)
Required Directory Structure

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
/caregiver-platform/
├── /docs/                          # All resource documents
├── /src/
│   ├── /app/                       # Next.js App Router pages
│   │   ├── /(auth)/                # Authentication routes
│   │   ├── /dashboard/             # Role-based dashboards
│   │   │   ├── /guardian/
│   │   │   ├── /company/
│   │   │   ├── /caregiver/
│   │   │   └── /moderator/
│   │   ├── /api/                   # API routes
│   │   │   ├── /auth/
│   │   │   ├── /users/
│   │   │   ├── /companies/
│   │   │   ├── /caregivers/
│   │   │   ├── /patients/
│   │   │   ├── /jobs/
│   │   │   ├── /packages/
│   │   │   ├── /payments/
│   │   │   └── /admin/
│   │   ├── /components/            # Reusable components
│   │   │   ├── /ui/               # shadcn/ui (existing)
│   │   │   ├── /forms/            # Form components
│   │   │   ├── /cards/            # Card components
│   │   │   ├── /charts/           # Dashboard charts
│   │   │   └── /layout/           # Layout components
│   │   ├── /lib/                   # Utilities and configurations
│   │   │   ├── /auth/              # Authentication logic
│   │   │   ├── /db/                # Database configurations
│   │   │   ├── /utils/             # Helper functions
│   │   │   ├── /validations/       # Zod schemas
│   │   │   └── /constants/         # App constants
│   │   └── /hooks/                 # Custom React hooks
├── /prisma/
│   ├── schema.prisma                # Database schema
│   ├── /migrations/                # Database migrations
│   └── /seed/                      # Seed data
├── /public/
│   ├── /locales/                   # i18n translations
│   │   ├── en.json
│   │   └── bn.json
│   └── /images/                    # Static images
└── /types/                         # TypeScript type definitions
🚀 DEVELOPMENT PHASES & SEQUENCE
Phase 1: Foundation Setup (Priority: CRITICAL)
Database Schema Implementation
Update prisma/schema.prisma with complete data model
Run migrations and seed data
Set up database connections
Authentication System
Implement JWT-based authentication
Role-based access control (RBAC)
MFA for companies and moderators
Phone number + OTP login for Bangladesh
Core Infrastructure
API error handling and validation
Logging and monitoring setup
File upload system (S3 integration)
Notification system foundation
Phase 2: User Management (Priority: HIGH)
User Registration & Profiles
Guardian registration and patient management
Company onboarding workflow
Caregiver profile and verification
Moderator admin panel
Role-Based Dashboards
Guardian dashboard (patient overview, job tracking)
Company dashboard (roster, packages, assignments)
Caregiver mobile app interface
Moderator verification queue
Phase 3: Core Features (Priority: HIGH)
Package Management
Company package creation
Package browsing and purchasing
Payment integration (bKash/Nagad)
Job Assignment & Scheduling
Job creation from packages
Caregiver assignment system
Calendar and conflict detection
Backup caregiver assignment
Phase 4: Care Delivery (Priority: MEDIUM)
Care Logging System
Check-in/check-out with GPS
Vitals and medication logging
Photo verification
Incident reporting
Communication & Monitoring
In-app messaging
Real-time notifications
Guardian monitoring dashboard
Company QA review system
Phase 5: Advanced Features (Priority: MEDIUM)
Payment & Financial
Escrow system
Commission calculation
Payout processing
Invoice generation
Ratings & Feedback
Multi-directional rating system
Feedback management
Dispute resolution workflow
Performance analytics
📊 PROGRESS TRACKING SYSTEM
Master Progress Checklist
The agent must maintain and update PROGRESS_CHECKLIST.md after each major task completion.

Progress Categories
DATABASE - Schema, migrations, seeds
AUTHENTICATION - Login, roles, permissions
API - Endpoints, validation, error handling
FRONTEND - Pages, components, routing
INTEGRATIONS - Payments, notifications, file storage
TESTING - Unit tests, integration tests
DEPLOYMENT - Build, deployment configuration
Progress Metrics
Completion Percentage: Overall project progress
Task Status: Not Started, In Progress, Completed, Blocked
Priority Level: Critical, High, Medium, Low
Dependencies: Task prerequisites
Time Estimates: Expected completion time
Actual Time: Time taken for completed tasks
🔧 TECHNICAL IMPLEMENTATION GUIDELINES
Code Standards
TypeScript Strict Mode - All code must be fully typed
ESLint Configuration - Follow existing linting rules
Component Structure - Use consistent patterns
Error Handling - Implement comprehensive error boundaries
Security - Validate all inputs, sanitize outputs
Database Implementation
Follow Exact Schema - Implement data model exactly as specified
Use Prisma Best Practices - Proper relationships and validations
Index Optimization - Implement recommended indexes
Seed Data - Create realistic test data for development
API Development
RESTful Design - Follow REST conventions
Status Codes - Use appropriate HTTP status codes
Response Format - Consistent JSON response structure
Rate Limiting - Implement rate limiting as specified
Documentation - Include API documentation
Frontend Development
Mobile-First Design - Responsive design principles
Accessibility - WCAG 2.1 AA compliance
Performance - Optimize for fast loading
User Experience - Follow UX flow diagrams
Bilingual Support - English/Bengali localization
🎨 DESIGN SYSTEM IMPLEMENTATION
Color Palette
css

Line Wrapping

Collapse
Copy
1
2
3
4
5
6
7
8
9
10
11
/* Primary Colors - Use exactly as specified */
--color-primary-500: #00AEEF;  /* Main interactive color */
--color-success-main: #3CCF4E;
--color-error-main: #FF4D4D;
--color-warning-main: #FFA500;

/* Dark Theme (Default) */
--color-bg-primary: #0e0e0e;
--color-bg-secondary: #1a1a1a;
--color-text-primary: #FFFFFF;
--color-text-secondary: #B3B3B3;
Typography
Font Family: Inter, Nunito Sans (primary), Kalpurush (Bengali)
Font Sizes: 16px base, 14px minimum, responsive scaling
Line Height: 1.5 for body text, 1.25 for headings
Component Standards
Buttons: 48px minimum touch targets, consistent styling
Cards: 8px border radius, consistent padding (24px)
Forms: Proper labels, validation states, error handling
Navigation: Logical tab order, skip navigation link
🔐 SECURITY IMPLEMENTATION
Authentication & Authorization
JWT Tokens - 15-minute access, 7-day refresh
MFA - Required for companies and moderators
Role-Based Access - Strict permission enforcement
Session Management - Secure session handling
Data Protection
Encryption - AES-256 for sensitive data
Input Validation - Comprehensive validation using Zod
SQL Injection Prevention - Use Prisma parameterized queries
XSS Protection - Sanitize all user inputs
Compliance
Data Localization - Store data within Bangladesh regions
Consent Management - Implement consent mechanisms
Audit Trails - Log all critical actions
Data Retention - 5-year retention policy
📱 BANGLADESH MARKET SPECIFICS
Payment Integration
bKash Integration - Checkout URL and Tokenized API
Nagad Integration - PGW API implementation
Escrow System - Secure payment holding
Refund Processing - Automated refund workflows
Localization
Bengali Language - Complete translation support
Currency Format - BDT (৳) symbol and formatting
Date/Time - Local formats and timezone
Phone Numbers - Bangladesh format validation (+8801XXXXXXXXX)
Cultural Considerations
Family Structure - Multi-guardian support
Elder Care Focus - Age-appropriate interfaces
Trust Signals - Verification and ratings emphasis
Mobile-First - Smartphone-centric design
🚀 DEPLOYMENT & MONITORING
Development Environment
Local Development - SQLite for quick iteration
Staging Environment - PostgreSQL with test data
Environment Variables - Secure configuration management
Production Deployment
Build Process - Optimized production builds
Database Migration - Zero-downtime migrations
CDN Setup - Static asset optimization
Monitoring - Error tracking and performance metrics
Quality Assurance
Automated Testing - Unit and integration tests
Code Quality - ESLint and TypeScript checks
Performance - Lighthouse audits
Security - Regular security audits
📋 TASK EXECUTION PROTOCOL
Daily Workflow
Morning Check-in - Review progress checklist
Priority Tasks - Focus on critical path items
Progress Updates - Update checklist after each task
Issue Resolution - Document blockers and solutions
End-of-day Review - Plan next day's priorities
Task Management
Break Down Tasks - Convert features into small, manageable tasks
Estimate Time - Provide realistic time estimates
Track Dependencies - Identify and manage task dependencies
Document Decisions - Record important technical decisions
Quality Gates - Ensure quality standards before proceeding
Problem Solving
Research - Consult resource documents first
Experiment - Create proof-of-concepts for complex features
Iterate - Refine implementations based on feedback
Document - Share solutions and best practices
🎯 SUCCESS CRITERIA
Functional Requirements
 All user roles can register and authenticate
 Complete package purchase workflow functional
 Job assignment and scheduling working
 Care logging with GPS verification
 Payment processing with bKash/Nagad
 Rating and feedback system operational
 Admin panels for all management functions
Non-Functional Requirements
 Page load times < 2 seconds
 Mobile responsive design
 WCAG 2.1 AA accessibility compliance
 Bengali language support complete
 Security audit passed
 Performance benchmarks met
Business Requirements
 5 pilot companies can be onboarded
 50 caregivers can be verified
 200 patients can be registered
 100 jobs can be completed end-to-end
 Payment processing成功率 > 95%
📞 ESCALATION PROTOCOL
Blocker Categories
Technical Blockers - Implementation challenges
Requirement Clarifications - Ambiguous specifications
Resource Gaps - Missing information or tools
Integration Issues - Third-party service problems
Resolution Process
Document Issue - Clear problem description
Research Solutions - Consult all available resources
Attempt Resolution - Try multiple approaches
Document Attempts - Record what was tried
Mark as Blocked - Update checklist with blocker status
📈 CONTINUOUS IMPROVEMENT
Learning Loop
Track Metrics - Monitor development velocity and quality
Identify Patterns - Recognize recurring issues
Optimize Processes - Improve development workflows
Update Documentation - Keep manuals current
Knowledge Base
Code Snippets - Reusable code patterns
Solutions Library - Document problem resolutions
Best Practices - Evolving coding standards
Lessons Learned - Project insights and improvements
🏁 PROJECT COMPLETION
Final Checklist
 All features implemented and tested
 Documentation complete
 Security audit passed
 Performance benchmarks met
 User acceptance criteria satisfied
 Deployment ready
Handoff Preparation
Code Review - Final code quality check
Documentation - Complete technical documentation
Deployment Guide - Step-by-step deployment instructions
Maintenance Guide - Ongoing maintenance procedures
📞 EMERGENCY CONTACTS
System Failures
Database Issues - Check connection, migrations, seed data
Authentication Failures - Verify JWT configuration, role permissions
Payment Issues - Check gateway integration, escrow logic
Performance Issues - Monitor queries, implement caching
Critical Decision Points
Architecture Changes - Must align with technical specifications
Feature Modifications - Must maintain PRD compliance
Security Changes - Must maintain compliance requirements
Market Adaptations - Must preserve Bangladesh market fit

