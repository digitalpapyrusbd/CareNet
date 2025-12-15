# Caregiver Digital Solution – Product Requirements Document (PRD)

**Document Version:** 1.0
**Last Updated:** [Current Date]
**Owner:** Product Team
**Status:** Draft / In Review

# Caregiver Digital Solution – Executive Overview

## Problem Statement
Bangladesh’s caregiver ecosystem is fragmented and largely offline. Families seeking professional home-care struggle to verify caregivers, compare service packages, or track the quality of ongoing care.
Caregiving companies operate in silos — each maintaining separate rosters, manual scheduling, and cash-based payments.

The result:
- Shortage of verified caregivers in the right locations
- Lack of transparency for guardians and patients
- No unified digital infrastructure for care delivery, monitoring, and compliance

This gap widens as the country’s aging population grows and chronic-care needs rise.

---

## Market Opportunity
- **Home-care demand:** Estimated **200K+ households** in urban Bangladesh require some form of in-home caregiving support.
- **Private caregiving companies:** Over **300 small-to-mid providers** operate without standardized digital systems.
- **Digital adoption:** Smartphone penetration exceeds **60%**, and **mobile wallet usage** (bKash/Nagad) is mainstream.

The market is primed for a **platform model** that connects patients, guardians, caregivers, and service providers — turning fragmented supply into an organized ecosystem.

---

## Target Users

### Primary Users
- **Guardians/Family Members** (20-60 years old): Adult children caring for elderly parents, spouses managing chronically ill partners
- **Patients** (60+ years old or chronically ill): Individuals requiring daily assistance, medication management, or post-surgery care
- **Caregiving Companies** (Small to mid-sized): 5-100 employee operations, annual revenue BDT 50L-5Cr, currently using Excel/WhatsApp for coordination
- **Professional Caregivers** (25-55 years old): Trained nurses, nursing aides, companions with 1-10 years experience

### Secondary Users
- **Moderators/Platform Admins**: Quality control team, dispute resolution specialists
- **Healthcare Partners** (Future): Diagnostic labs, medical equipment rental services, telemedicine providers


## Key Differentiators
| Category | What Sets This Platform Apart |
|-----------|-------------------------------|
| **Compliance & Trust** | Verified caregivers, audit trails, background checks, and transparent ratings. |
| **Localization** | Full bilingual support (English/Bengali), local payment gateways, culturally adapted UX. |
| **Marketplace Model** | Unified hub for multiple caregiving companies, enabling discovery, onboarding, and service matching. |
| **Transparency & Data Portability** | Guardians can view care logs, download reports, and shift between providers without losing records. |
| **Scalability** | Modular architecture designed for expansion into diagnostics, medical rentals, and telehealth integrations. |


## Vision & Mission

**Vision:** Become Bangladesh's most trusted digital ecosystem for professional home-based care, connecting 100,000+ families with verified caregivers by 2027.

**Mission:** Empower families to find, manage, and monitor quality care through transparent, technology-enabled solutions that dignify both caregivers and patients.

### Strategic Objectives (Year 1)
1. **Trust & Safety**: Achieve 90%+ verified caregiver rate with zero major safety incidents
2. **Market Penetration**: Onboard 100+ caregiving companies and 10,000+ active caregivers
3. **User Satisfaction**: Maintain NPS ≥70 across all user segments
4. **Localization**: Drive 50%+ platform usage in Bengali language
5. **Financial Sustainability**: Process BDT 10M+ in transactions with positive unit economics
6. **Operational Excellence**: Resolve 95% of disputes within 48 hours
---

## User Roles & Permissions
| Role | Core Abilities |
|------|----------------|
| **Super Admin** | Manage moderators, global settings, payment disputes |
| **Moderator** | Verify companies/caregivers, manage CV pool, resolve disputes |
| **Company** | Manage roster, packages, assignments, QA |
| **Caregiver** | View patients, log visits, apply for jobs, receive ratings |
| **Guardian** | Register patients, purchase packages, monitor care |
| **Patient** | Access records, view caregivers, schedules |


## Core Features by Role

### Guardian Portal
- **Patient Management**: Multi-patient profiles, medical history, prescriptions upload
- **Discovery**: Browse companies by location, ratings, specializations (elderly care, post-surgery, dementia)
- **Booking**: Compare packages, read reviews, purchase with installment options
- **Monitoring**: Real-time care logs, medication adherence tracking, visit photo verification
- **Communication**: In-app messaging with caregivers, emergency contact protocols
- **Payments**: Invoice history, receipt downloads, refund requests

### Company Dashboard
- **Roster Management**: Caregiver profiles, certifications expiry alerts, availability calendars
- **Package Builder**: Create custom care packages (hourly, daily, weekly, monthly rates)
- **Job Assignment**: Drag-and-drop scheduler, conflict detection, primary + backup assignments
- **Quality Assurance**: Review caregiver logs, flag incidents, respond to guardian feedback
- **Financial**: Earnings dashboard, payout schedules, commission reports
- **Analytics**: Caregiver utilization rates, patient satisfaction trends, revenue forecasts

### Caregiver Mobile App
- **Job Management**: View assigned patients, shift timings, location navigation
- **Check-In/Out**: GPS-verified clock-in, photo uploads, visit summaries
- **Care Logging**: Vitals entry (BP, glucose, temp), medication given, meal tracking, mobility notes
- **Patient Info**: Access care plans, emergency contacts, medication schedules
- **Earnings**: Real-time pay tracking, shift history, tip collection
- **Learning**: Training modules, certification renewals, skill badges

### Moderator Admin Panel
- **Verification Queue**: Review company licenses, caregiver NID/certificates, background checks
- **CV Pool**: Maintain searchable database of pre-verified caregivers for marketplace jobs
- **Dispute Resolution**: Case management system, evidence review, decision logging
- **Platform Analytics**: User growth, transaction volumes, quality metrics
- **Content Moderation**: Review ratings/comments, flag inappropriate content
---

## End-to-End Workflows
### Company Onboarding & Caregiver Management
- Registration: profile, licenses, payment setup, service zones.
- Caregiver onboarding via **HR upload or moderator pool**.
- Verification: ID, certifications, background, availability calendar.
- Escrow-based payment safety.

### Patient & Guardian Journey
- Guardian registers patient, selects company/package.
- Payment → invoice → receipt.
- Care plan visible to caregivers (reports, prescriptions, schedules).

### Job/Package Assignment
- Company creates job and assigns caregivers (primary + backup).
- Shift calendar with conflict detection.

### Care Delivery
- **Caregiver App:** clock-in/out, vitals, notes, medication logs.
- **Guardian:** real-time monitoring + missed alert notifications.
- **Company:** QA reviews, incident logging, feedback reporting loop.

### Marketplace Jobs
- Jobs posted → caregivers apply → moderator validates → assignment.
- Later phase: AI matching based on proximity, skill, availability.

### Ratings & Feedback Loop
- **Post-Job Rating**: Guardians rate caregivers (1-5 stars) with optional comments
- **Caregiver Ratings**: Caregivers rate guardians/patients (respect, safety, payment timeliness)
- **Company Performance**: Aggregate scores affect search ranking and badge eligibility
- **Dispute Handling**:
  - Guardian files complaint → Moderator reviews logs → Company responds within 24h
  - Escalation path: Moderator decision → Appeal to Super Admin → Final resolution
  - Outcomes: Refunds, caregiver suspension, company warnings, account termination
---

## Business Model

### Revenue Streams
1. **Transaction Fees**: 10-15% commission on all package sales
2. **SaaS Subscriptions**: Monthly fees for companies based on active caregiver count
   - **Starter Tier** (1-10 caregivers): BDT 5,000/month
   - **Growth Tier** (11-50 caregivers): BDT 20,000/month
   - **Enterprise Tier** (50+ caregivers): Custom pricing
3. **Premium Features** (Future):
   - Priority customer support
   - Advanced analytics dashboards
   - White-label solutions for large providers
   - API access for integrations

### Pricing Philosophy
- **No fees for guardians/patients**: Built into package pricing
- **Free for caregivers**: Companies absorb platform costs
- **Transparent commissions**: Clearly displayed before purchase
- **Flexible payments**: Installments via bKash/Nagad EMI (future)

### Unit Economics (Target)
- Average package value: BDT 15,000
- Platform commission (12%): BDT 1,800
- Customer acquisition cost: BDT 800
- Contribution margin: BDT 1,000 per transaction

## Roadmap
### Phase 1: Foundation (MVP) – Weeks 1-12
**Goal**: Validate core hypothesis with pilot companies

**Features**:
- User registration & authentication (JWT, MFA for companies)
- Role-based dashboards (Guardian, Company, Caregiver, Moderator)
- Package purchase flow with bKash/Nagad integration
- Basic job assignment and caregiver clock-in/out
- Bilingual support (English default, Bengali toggle)
- SMS/email notifications for key events

**Success Criteria**:
- 5 pilot companies onboarded
- 50 caregivers verified and active
- 200 patients registered
- 100 completed jobs with ≥4-star average rating
- Zero critical bugs or payment failures

---

### Phase 2: Growth (Marketplace) – Weeks 13-36
**Goal**: Scale supply and introduce marketplace dynamics

**Features**:
- Public job board where caregivers apply for open positions
- AI-assisted matching (proximity, skills, availability, ratings)
- Shift conflict detection and alerts
- Integration with diagnostic labs (test booking, report uploads)
- Medical equipment rental marketplace
- In-app messaging between guardians and caregivers
- Advanced analytics for companies (caregiver performance heatmaps)

**Success Criteria**:
- 50 companies, 2,000 caregivers, 5,000 patients
- 30% of jobs filled via marketplace (vs direct assignment)
- BDT 5M in monthly transaction volume
- <5% dispute rate

---

### Phase 3: Intelligence (Ecosystem) – Weeks 37-72
**Goal**: Automation, partnerships, and regional expansion

**Features**:
- Predictive analytics (caregiver churn risk, demand forecasting)
- Automated alerts (missed medication doses, abnormal vitals)
- Telehealth integration (video consultations with doctors)
- Partner APIs for hospitals and nursing homes (bulk bookings)
- Multi-city launch (Chattogram, Sylhet)
- Caregiver training academy with certification programs

**Success Criteria**:
- 100+ companies, 10,000 caregivers, 20,000 patients
- 50% Bengali language usage
- 90% caregiver verification rate
- NPS ≥70 across all segments
- Break-even on operating costs

---

## Success Metrics
- Adoption (# of companies onboarded)
- Engagement (# of active caregivers/patients)
- Trust (% verified caregivers)
- Revenue (total processed payments)
- Localization adoption (% users using Bengali)
- Retention (30-day active rate)
- Dispute resolution time
- Satisfaction (NPS ratings)

## Risk Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Low Company Adoption** | High | Medium | Pilot incentives (3 months free SaaS), dedicated onboarding support |
| **Caregiver Quality Issues** | High | Medium | Mandatory background checks, probation period, rating thresholds (suspend if <3.5 stars) |
| **Payment Gateway Failures** | High | Low | Multi-gateway redundancy (bKash + Nagad + cards), escrow protection |
| **Data Breach** | Critical | Low | AES-256 encryption, quarterly pen tests, cyber insurance |
| **Regulatory Changes** | Medium | Medium | Legal advisory retainer, compliance buffer in roadmap |
| **User Churn** | Medium | Medium | Net Promoter Score tracking, exit surveys, win-back campaigns |

---

## Go-to-Market Strategy

### Phase 1: Pilot Launch (Months 1-3)
- **Target**: Dhaka metro area (Gulshan, Banani, Dhanmondi, Uttara)
- **Tactics**: Direct outreach to 50 caregiving companies, offer 90-day free trial
- **Partnerships**: Tie-ups with 3 major hospitals for patient referrals
- **PR**: Launch event, press release in *Prothom Alo*, *Daily Star*

### Phase 2: Demand Generation (Months 4-9)
- **Digital Marketing**:
  - Facebook/Instagram ads targeting families (age 30-55, interests: elderly care, healthcare)
  - Google Search ads ("home nurse Dhaka", "caregivers for elderly")
  - SEO content (blog on dementia care, post-surgery tips)
- **Referral Program**: Guardians earn BDT 500 credit for each successful referral
- **Community Outreach**: Workshops at community centers, senior citizen clubs

### Phase 3: Expansion (Months 10-18)
- **Geographic**: Expand to Chattogram, Sylhet
- **Vertical**: B2B packages for corporate employee benefits (elder care as perk)
- **Influencer Marketing**: Collaborate with healthcare influencers, patient advocacy groups