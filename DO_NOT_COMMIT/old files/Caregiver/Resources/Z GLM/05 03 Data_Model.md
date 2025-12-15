# Data Model (Key Entities)

**Version:** 1.0  
**Last Updated:** [Current Date]  
**Database:** PostgreSQL 15+  
**ORM:** Prisma (recommended) or TypeORM

---

## Design Principles

1. **Normalization**: 3NF (Third Normal Form) to minimize redundancy
2. **Soft Deletes**: Use `deleted_at` timestamp instead of hard deletes for audit trails
3. **Timestamps**: Every table has `created_at` and `updated_at`
4. **UUIDs**: Use UUID v4 for primary keys (better for distributed systems, no sequential ID leakage)
5. **Indexes**: Add indexes on foreign keys and frequently queried columns
6. **Partitioning**: Partition large tables (logs, audit_logs) by date for performance
7. **JSON Fields**: Use JSONB for flexible metadata (search_metadata, preferences)

## Core Entities (Detailed)

### User
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `role` | ENUM | NOT NULL | `super_admin`, `moderator`, `company`, `caregiver`, `guardian`, `patient` |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Primary login identifier (BD format: +8801XXXXXXXXX) |
| `email` | VARCHAR(255) | UNIQUE, NULLABLE | Optional for elderly users |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hashed |
| `name` | VARCHAR(255) | NOT NULL | Full name |
| `language` | VARCHAR(5) | DEFAULT 'en' | `en` or `bn` |
| `kyc_status` | ENUM | DEFAULT 'pending' | `pending`, `verified`, `rejected` |
| `kyc_document_url` | TEXT | NULLABLE | Link to NID/passport scan |
| `mfa_enabled` | BOOLEAN | DEFAULT false | Two-factor authentication |
| `mfa_secret` | VARCHAR(255) | NULLABLE | TOTP secret |
| `last_login_at` | TIMESTAMP | NULLABLE | Track activity |
| `is_active` | BOOLEAN | DEFAULT true | Account status |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL | Auto-generated |
| `updated_at` | TIMESTAMP | NOT NULL | Auto-updated |

**Indexes**:
```sql
CREATE INDEX idx_user_phone ON users(phone);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_kyc_status ON users(kyc_status);
```

---

### Company
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY → users(id) | Owner account |
| `company_name` | VARCHAR(255) | NOT NULL | Legal business name |
| `trade_license` | VARCHAR(100) | UNIQUE, NOT NULL | Government registration number |
| `trade_license_url` | TEXT | NULLABLE | Scanned document |
| `tin` | VARCHAR(50) | NULLABLE | Tax identification number |
| `contact_person` | VARCHAR(255) | NOT NULL | Primary contact name |
| `contact_phone` | VARCHAR(20) | NOT NULL | Support number |
| `contact_email` | VARCHAR(255) | NULLABLE | Support email |
| `address` | TEXT | NOT NULL | Physical office address |
| `logo_url` | TEXT | NULLABLE | Company logo (S3 link) |
| `description` | TEXT | NULLABLE | About the company |
| `specializations` | JSONB | NULLABLE | `["elderly_care", "post_surgery", "dementia"]` |
| `payout_method` | ENUM | NOT NULL | `bank_transfer`, `bkash`, `nagad` |
| `payout_account` | VARCHAR(255) | NOT NULL | Account number/mobile wallet |
| `commission_rate` | DECIMAL(5,2) | DEFAULT 12.00 | Platform commission % |
| `subscription_tier` | ENUM | DEFAULT 'starter' | `starter`, `growth`, `enterprise` |
| `subscription_expires_at` | TIMESTAMP | NULLABLE | Subscription end date |
| `rating_avg` | DECIMAL(3,2) | DEFAULT 0.00 | Aggregate rating (0-5) |
| `rating_count` | INTEGER | DEFAULT 0 | Total reviews |
| `is_verified` | BOOLEAN | DEFAULT false | Moderator approval |
| `verification_notes` | TEXT | NULLABLE | Moderator comments |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_company_user_id ON companies(user_id);
CREATE INDEX idx_company_verified ON companies(is_verified);
CREATE INDEX idx_company_rating ON companies(rating_avg DESC);
```

---

### Caregiver
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FOREIGN KEY → users(id) | Login account |
| `company_id` | UUID | FOREIGN KEY → companies(id), NULLABLE | Employed by (null if freelance) |
| `nid` | VARCHAR(20) | UNIQUE, NOT NULL | National ID |
| `nid_url` | TEXT | NOT NULL | Scanned NID front/back |
| `photo_url` | TEXT | NOT NULL | Profile photo |
| `date_of_birth` | DATE | NOT NULL | Age verification |
| `gender` | ENUM | NOT NULL | `male`, `female`, `other` |
| `address` | TEXT | NOT NULL | Current residence |
| `location_lat` | DECIMAL(10,8) | NULLABLE | GPS for proximity matching |
| `location_lng` | DECIMAL(11,8) | NULLABLE | |
| `skills` | JSONB | NOT NULL | `["medication_mgmt", "mobility_assist", "dementia_care"]` |
| `certifications` | JSONB | NULLABLE | `[{"name": "BNC", "expiry": "2025-12-31", "url": "..."}]` |
| `experience_years` | INTEGER | DEFAULT 0 | Total years |
| `languages` | JSONB | DEFAULT '["bn"]' | `["bn", "en"]` |
| `availability_calendar` | JSONB | NULLABLE | Weekly schedule (see schema below) |
| `hourly_rate` | DECIMAL(8,2) | NULLABLE | Expected pay (BDT) |
| `background_check_status` | ENUM | DEFAULT 'pending' | `pending`, `cleared`, `flagged` |
| `background_check_date` | DATE | NULLABLE | Last verification |
| `rating_avg` | DECIMAL(3,2) | DEFAULT 0.00 | |
| `rating_count` | INTEGER | DEFAULT 0 | |
| `total_jobs_completed` | INTEGER | DEFAULT 0 | Career stats |
| `is_available` | BOOLEAN | DEFAULT true | Currently accepting jobs |
| `is_verified` | BOOLEAN | DEFAULT false | |
| `deleted_at` | TIMESTAMP | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Availability Calendar Schema** (JSONB):
```json
{
  "monday": [{"start": "08:00", "end": "16:00"}],
  "tuesday": [{"start": "08:00", "end": "16:00"}],
  "wednesday": [],
  "thursday": [{"start": "08:00", "end": "12:00"}, {"start": "14:00", "end": "18:00"}],
  "friday": [{"start": "08:00", "end": "16:00"}],
  "saturday": [{"start": "09:00", "end": "13:00"}],
  "sunday": []
}
```

**Indexes**:
```sql
CREATE INDEX idx_caregiver_company_id ON caregivers(company_id);
CREATE INDEX idx_caregiver_location ON caregivers USING GIST(ll_to_earth(location_lat, location_lng));
CREATE INDEX idx_caregiver_skills ON caregivers USING GIN(skills);
CREATE INDEX idx_caregiver_verified ON caregivers(is_verified, is_available);
CREATE INDEX idx_caregiver_rating ON caregivers(rating_avg DESC);
```

---

### Patient
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FOREIGN KEY → users(id), NULLABLE | Optional self-managed account |
| `guardian_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Primary guardian |
| `name` | VARCHAR(255) | NOT NULL | |
| `date_of_birth` | DATE | NOT NULL | Age calculation |
| `gender` | ENUM | NOT NULL | `male`, `female`, `other` |
| `blood_group` | VARCHAR(5) | NULLABLE | `A+`, `O-`, etc. |
| `address` | TEXT | NOT NULL | Care location |
| `emergency_contact_name` | VARCHAR(255) | NOT NULL | |
| `emergency_contact_phone` | VARCHAR(20) | NOT NULL | |
| `primary_conditions` | JSONB | NULLABLE | `["diabetes", "hypertension", "alzheimers"]` |
| `allergies` | TEXT | NULLABLE | Drug/food allergies |
| `mobility_level` | ENUM | DEFAULT 'independent' | `independent`, `assisted`, `wheelchair`, `bedridden` |
| `cognitive_status` | ENUM | DEFAULT 'normal' | `normal`, `mild_impairment`, `moderate`, `severe` |
| `photo_url` | TEXT | NULLABLE | |
| `consent_data_sharing` | BOOLEAN | DEFAULT false | Share with labs/partners |
| `consent_marketing` | BOOLEAN | DEFAULT false | Promotional emails |
| `deleted_at` | TIMESTAMP | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_patient_guardian_id ON patients(guardian_id);
CREATE INDEX idx_patient_conditions ON patients USING GIN(primary_conditions);
```

---

### HealthRecord
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `patient_id` | UUID | FOREIGN KEY → patients(id), NOT NULL | |
| `record_type` | ENUM | NOT NULL | `prescription`, `lab_report`, `diagnosis`, `medication_schedule`, `note` |
| `title` | VARCHAR(255) | NOT NULL | "Dr. Khan's Prescription" |
| `description` | TEXT | NULLABLE | Additional context |
| `file_url` | TEXT | NULLABLE | PDF/image link |
| `metadata` | JSONB | NULLABLE | Parsed data (drugs, dosages, schedules) |
| `uploaded_by` | UUID | FOREIGN KEY → users(id) | Guardian or caregiver |
| `valid_from` | DATE | NULLABLE | Prescription start date |
| `valid_until` | DATE | NULLABLE | Prescription end date |
| `is_archived` | BOOLEAN | DEFAULT false | Hide from active view |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Metadata Schema Example** (for `medication_schedule`):
```json
{
  "medications": [
    {
      "name": "Metformin 500mg",
      "dosage": "1 tablet",
      "frequency": "twice_daily",
      "times": ["08:00", "20:00"],
      "with_food": true,
      "notes": "Take after meals"
    }
  ]
}
```

**Indexes**:
```sql
CREATE INDEX idx_health_record_patient_id ON health_records(patient_id);
CREATE INDEX idx_health_record_type ON health_records(record_type);
```

---

### Package
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `company_id` | UUID | FOREIGN KEY → companies(id), NOT NULL | |
| `name` | VARCHAR(255) | NOT NULL | "Elder Care - Daily" |
| `description` | TEXT | NOT NULL | What's included |
| `category` | ENUM | NOT NULL | `elderly_care`, `post_surgery`, `chronic_illness`, `companion`, `nursing` |
| `price` | DECIMAL(10,2) | NOT NULL | Total cost (BDT) |
| `duration_days` | INTEGER | NOT NULL | Package length |
| `hours_per_day` | INTEGER | NOT NULL | Daily care hours |
| `inclusions` | JSONB | NOT NULL | `["medication_mgmt", "vitals_monitoring", "mobility_assist"]` |
| `exclusions` | JSONB | NULLABLE | `["medical_procedures", "overnight_stay"]` |
| `caregiver_count` | INTEGER | DEFAULT 1 | Primary + backups |
| `is_active` | BOOLEAN | DEFAULT true | Available for purchase |
| `min_advance_days` | INTEGER | DEFAULT 2 | Booking notice period |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_package_company_id ON packages(company_id);
CREATE INDEX idx_package_category ON packages(category);
CREATE INDEX idx_package_active ON packages(is_active);
```

---

### Job
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `package_id` | UUID | FOREIGN KEY → packages(id), NOT NULL | |
| `patient_id` | UUID | FOREIGN KEY → patients(id), NOT NULL | |
| `company_id` | UUID | FOREIGN KEY → companies(id), NOT NULL | |
| `guardian_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Purchaser |
| `start_date` | DATE | NOT NULL | |
| `end_date` | DATE | NOT NULL | Calculated from duration |
| `status` | ENUM | DEFAULT 'pending_assignment' | `pending_assignment`, `active`, `completed`, `cancelled`, `disputed` |
| `total_price` | DECIMAL(10,2) | NOT NULL | Locked at purchase |
| `commission_amount` | DECIMAL(10,2) | NOT NULL | Platform fee |
| `payout_amount` | DECIMAL(10,2) | NOT NULL | Company receives |
| `special_instructions` | TEXT | NULLABLE | Guardian notes |
| `completion_notes` | TEXT | NULLABLE | Final summary |
| `cancelled_reason` | TEXT | NULLABLE | |
| `cancelled_at` | TIMESTAMP | NULLABLE | |
| `cancelled_by` | UUID | FOREIGN KEY → users(id), NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_job_patient_id ON jobs(patient_id);
CREATE INDEX idx_job_company_id ON jobs(company_id);
CREATE INDEX idx_job_status ON jobs(status);
CREATE INDEX idx_job_dates ON jobs(start_date, end_date);
```

---

### Assignment
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `job_id` | UUID | FOREIGN KEY → jobs(id), NOT NULL | |
| `caregiver_id` | UUID | FOREIGN KEY → caregivers(id), NOT NULL | |
| `role` | ENUM | DEFAULT 'primary' | `primary`, `backup` |
| `shift_start_time` | TIME | NOT NULL | e.g., "08:00" |
| `shift_end_time` | TIME | NOT NULL | e.g., "16:00" |
| `days_of_week` | JSONB | NOT NULL | `["monday", "tuesday", "wednesday"]` |
| `status` | ENUM | DEFAULT 'assigned' | `assigned`, `active`, `completed`, `replaced` |
| `replaced_by` | UUID | FOREIGN KEY → caregivers(id), NULLABLE | If reassigned |
| `replacement_reason` | TEXT | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Constraint**: `UNIQUE(job_id, caregiver_id, role)` to prevent duplicate assignments

**Indexes**:
```sql
CREATE INDEX idx_assignment_job_id ON assignments(job_id);
CREATE INDEX idx_assignment_caregiver_id ON assignments(caregiver_id);
```

---

### Payment
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `job_id` | UUID | FOREIGN KEY → jobs(id), NOT NULL | |
| `payer_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Guardian |
| `amount` | DECIMAL(10,2) | NOT NULL | Total paid |
| `method` | ENUM | NOT NULL | `bkash`, `nagad`, `card`, `bank_transfer` |
| `transaction_id` | VARCHAR(255) | UNIQUE, NOT NULL | Gateway reference |
| `status` | ENUM | DEFAULT 'pending' | `pending`, `completed`, `failed`, `refunded` |
| `invoice_number` | VARCHAR(50) | UNIQUE, NOT NULL | Auto-generated |
| `invoice_url` | TEXT | NULLABLE | PDF link |
| `receipt_url` | TEXT | NULLABLE | PDF link |
| `paid_at` | TIMESTAMP | NULLABLE | Completion timestamp |
| `refund_amount` | DECIMAL(10,2) | DEFAULT 0.00 | Partial/full refunds |
| `refund_reason` | TEXT | NULLABLE | |
| `gateway_response` | JSONB | NULLABLE | Raw API response for debugging |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_payment_job_id ON payments(job_id);
CREATE INDEX idx_payment_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payment_status ON payments(status);
```

---

### CareLog (Visit Logs)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `job_id` | UUID | FOREIGN KEY → jobs(id), NOT NULL | |
| `assignment_id` | UUID | FOREIGN KEY → assignments(id), NOT NULL | |
| `caregiver_id` | UUID | FOREIGN KEY → caregivers(id), NOT NULL | |
| `patient_id` | UUID | FOREIGN KEY → patients(id), NOT NULL | |
| `log_type` | ENUM | NOT NULL | `check_in`, `vitals`, `medication`, `meal`, `activity`, `incident`, `check_out` |
| `timestamp` | TIMESTAMP | NOT NULL | Action time |
| `location_lat` | DECIMAL(10,8) | NULLABLE | GPS verification |
| `location_lng` | DECIMAL(11,8) | NULLABLE | |
| `data` | JSONB | NOT NULL | Log-specific data (see schemas below) |
| `notes` | TEXT | NULLABLE | Freeform notes |
| `photo_urls` | JSONB | NULLABLE | `["url1", "url2"]` |
| `guardian_notified` | BOOLEAN | DEFAULT false | Alert sent |
| `created_at` | TIMESTAMP | NOT NULL | |

**Data Schemas by Log Type**:

**Vitals**:
```json
{
  "blood_pressure": {"systolic": 120, "diastolic": 80},
  "heart_rate": 72,
  "temperature": 98.6,
  "blood_glucose": 110,
  "oxygen_saturation": 98
}
```

**Medication**:
```json
{
  "medication_name": "Metformin 500mg",
  "dosage": "1 tablet",
  "administered_at": "2025-01-15T08:30:00Z",
  "skipped": false,
  "skip_reason": null
}
```

**Incident**:
```json
{
  "incident_type": "fall",
  "severity": "minor",
  "action_taken": "Helped patient to bed, no injury observed",
  "medical_attention_required": false
}
```

**Indexes**:
```sql
CREATE INDEX idx_care_log_job_id ON care_logs(job_id);
CREATE INDEX idx_care_log_caregiver_id ON care_logs(caregiver_id);
CREATE INDEX idx_care_log_patient_id ON care_logs(patient_id);
CREATE INDEX idx_care_log_timestamp ON care_logs(timestamp DESC);
CREATE INDEX idx_care_log_type ON care_logs(log_type);
```

**Partitioning** (for scalability):
```sql
-- Partition by month
CREATE TABLE care_logs_2025_01 PARTITION OF care_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

### Feedback
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `job_id` | UUID | FOREIGN KEY → jobs(id), NOT NULL | Context |
| `reviewer_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Who's rating |
| `reviewee_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Who's being rated |
| `reviewee_type` | ENUM | NOT NULL | `caregiver`, `company`, `guardian` |
| `rating` | INTEGER | CHECK (1-5), NOT NULL | Star rating |
| `tags` | JSONB | NULLABLE | `["punctual", "caring", "professional"]` |
| `comments` | TEXT | NULLABLE | Freeform feedback |
| `is_public` | BOOLEAN | DEFAULT true | Show on profile |
| `company_response` | TEXT | NULLABLE | Company can reply |
| `responded_at` | TIMESTAMP | NULLABLE | |
| `flagged_inappropriate` | BOOLEAN | DEFAULT false | Moderator review |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Constraint**: `UNIQUE(job_id, reviewer_id, reviewee_id)` to prevent duplicate ratings

**Indexes**:
```sql
CREATE INDEX idx_feedback_reviewee ON feedback(reviewee_id, reviewee_type);
CREATE INDEX idx_feedback_job_id ON feedback(job_id);
CREATE INDEX idx_feedback_public ON feedback(is_public, rating DESC);
```

---

### AuditLog
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `actor_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Who performed action |
| `actor_role` | ENUM | NOT NULL | Role at time of action |
| `action_type` | VARCHAR(100) | NOT NULL | `user.created`, `payment.completed`, `job.cancelled` |
| `entity_type` | VARCHAR(50) | NOT NULL | `user`, `job`, `payment`, etc. |
| `entity_id` | UUID | NOT NULL | Target record |
| `changes` | JSONB | NULLABLE | Before/after snapshot |
| `ip_address` | INET | NULLABLE | Request origin |
| `user_agent` | TEXT | NULLABLE | Browser/device info |
| `timestamp` | TIMESTAMP | NOT NULL | |

**Changes Schema Example**:
```json
{
  "before": {"status": "pending"},
  "after": {"status": "active"},
  "fields_changed": ["status"]
}
```

**Indexes**:
```sql
CREATE INDEX idx_audit_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action_type);
```

**Partitioning**:
```sql
-- Partition by quarter
CREATE TABLE audit_logs_2025_q1 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

---

### ServiceZone
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `company_id` | UUID | FOREIGN KEY → companies(id), NOT NULL | |
| `zone_name` | VARCHAR(255) | NOT NULL | "Gulshan", "Dhanmondi" |
| `region_code` | VARCHAR(20) | NOT NULL | Postal code or area code |
| `boundary_geojson` | JSONB | NULLABLE | Polygon coordinates (future) |
| `is_active` | BOOLEAN | DEFAULT true | Currently servicing |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_service_zone_company_id ON service_zones(company_id);
CREATE INDEX idx_service_zone_region ON service_zones(region_code);
```

---

### Dispute
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `job_id` | UUID | FOREIGN KEY → jobs(id), NOT NULL | |
| `raised_by` | UUID | FOREIGN KEY → users(id), NOT NULL | |
| `against` | UUID | FOREIGN KEY → users(id), NOT NULL | |
| `dispute_type` | ENUM | NOT NULL | `payment`, `quality`, `safety`, `no_show`, `other` |
| `description` | TEXT | NOT NULL | Details |
| `evidence_urls` | JSONB | NULLABLE | `["screenshot1.png", "photo2.jpg"]` |
| `status` | ENUM | DEFAULT 'open' | `open`, `under_review`, `resolved`, `closed` |
| `assigned_moderator` | UUID | FOREIGN KEY → users(id), NULLABLE | |
| `resolution` | TEXT | NULLABLE | Moderator decision |
| `resolution_action` | ENUM | NULLABLE | `refund_full`, `refund_partial`, `warning`, `suspend_caregiver`, `no_action` |
| `resolved_at` | TIMESTAMP | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_dispute_job_id ON disputes(job_id);
CREATE INDEX idx_dispute_status ON disputes(status);
CREATE INDEX idx_dispute_moderator ON disputes(assigned_moderator);
```

---

### Notification
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Recipient |
| `type` | ENUM | NOT NULL | `sms`, `email`, `push`, `in_app` |
| `channel` | VARCHAR(50) | NOT NULL | `twilio`, `sendgrid`, `fcm` |
| `title` | VARCHAR(255) | NULLABLE | Push/in-app title |
| `body` | TEXT | NOT NULL | Message content |
| `data` | JSONB | NULLABLE | Additional payload |
| `status` | ENUM | DEFAULT 'pending' | `pending`, `sent`, `delivered`, `failed`, `read` |
| `sent_at` | TIMESTAMP | NULLABLE | |
| `delivered_at` | TIMESTAMP | NULLABLE | |
| `read_at` | TIMESTAMP | NULLABLE | For in-app |
| `error_message` | TEXT | NULLABLE | Failure reason |
| `created_at` | TIMESTAMP | NOT NULL | |

**Indexes**:
```sql
CREATE INDEX idx_notification_user_id ON notifications(user_id);
CREATE INDEX idx_notification_status ON notifications(status);
CREATE INDEX idx_notification_sent_at ON notifications(sent_at DESC);
```

---

### MarketplaceJob (Phase 2)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `company_id` | UUID | FOREIGN KEY → companies(id), NOT NULL | Posted by |
| `title` | VARCHAR(255) | NOT NULL | "Need Elder Care Nurse - Gulshan" |
| `description` | TEXT | NOT NULL | |
| `location` | VARCHAR(255) | NOT NULL | |
| `required_skills` | JSONB | NOT NULL | `["medication_mgmt", "mobility_assist"]` |
| `start_date` | DATE | NOT NULL | |
| `duration_days` | INTEGER | NOT NULL | |
| `hours_per_day` | INTEGER | NOT NULL | |
| `offered_rate` | DECIMAL(8,2) | NOT NULL | Per hour/day |
| `status` | ENUM | DEFAULT 'open' | `open`, `closed`, `filled` |
| `applications_count` | INTEGER | DEFAULT 0 | |
| `filled_by` | UUID | FOREIGN KEY → caregivers(id), NULLABLE | Selected caregiver |
| `filled_at` | TIMESTAMP | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

---

### JobApplication (Phase 2)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | |
| `marketplace_job_id` | UUID | FOREIGN KEY → marketplace_jobs(id), NOT NULL | |
| `caregiver_id` | UUID | FOREIGN KEY → caregivers(id), NOT NULL | |
| `cover_letter` | TEXT | NULLABLE | |
| `status` | ENUM | DEFAULT 'pending' | `pending`, `shortlisted`, `rejected`, `accepted` |
| `reviewed_by` | UUID | FOREIGN KEY → users(id), NULLABLE | Moderator/Company |
| `reviewed_at` | TIMESTAMP | NULLABLE | |
| `review_notes` | TEXT | NULLABLE | |
| `created_at` | TIMESTAMP | NOT NULL | |

**Constraint**: `UNIQUE(marketplace_job_id, caregiver_id)`

---

### Relationships
## Relationships & Cardinality

### One-to-Many (1:N)
- `User` (1) → `Company` (N) - A user can own multiple companies
- `Company` (1) → `Caregiver` (N) - A company employs many caregivers
- `Company` (1) → `Package` (N) - A company offers many packages
- `Company` (1) → `ServiceZone` (N) - A company services multiple zones
- `User/Guardian` (1) → `Patient` (N) - A guardian manages multiple patients
- `Patient` (1) → `Job` (N) - A patient can have multiple jobs
- `Job` (1) → `Assignment` (N) - A job has multiple assignments (primary + backups)
- `Job` (1) → `Payment` (1) - One payment per job
- `Job` (1) → `CareLog` (N) - Many logs per job
- `Job` (1) → `Feedback` (N) - Multiple reviews per job
- `Caregiver` (1) → `Assignment` (N)

Many-to-Many (M:N)

Caregiver ↔ Job (through Assignment) - Caregivers work on multiple jobs, jobs have multiple caregivers
User ↔ Notification - Users receive many notifications

Self-Referential

Caregiver.replaced_by → Caregiver (for replacement tracking)
User → User (in AuditLog.actor_id, Dispute.raised_by, etc.)

Polymorphic Relationships

Feedback.reviewee_id can reference Caregiver, Company, or Guardian (based on reviewee_type)

---

Foreign Key Constraints
Cascade Rules:

-- When a user is deleted (soft delete), nullify references
ALTER TABLE companies 
  ADD CONSTRAINT fk_company_user 
  FOREIGN KEY (user_id) REFERENCES users(id) 
  ON DELETE SET NULL;

-- When a job is deleted, cascade delete assignments
ALTER TABLE assignments 
  ADD CONSTRAINT fk_assignment_job 
  FOREIGN KEY (job_id) REFERENCES jobs(id) 
  ON DELETE CASCADE;

-- When a patient is deleted, restrict if they have active jobs
ALTER TABLE jobs 
  ADD CONSTRAINT fk_job_patient 
  FOREIGN KEY (patient_id) REFERENCES patients(id) 
  ON DELETE RESTRICT;
````
````

---

## **ADD new section after "### ER Diagram (Conceptual)"**

````markdown
## Database Constraints & Business Rules

### Check Constraints
```sql
-- Ensure ratings are between 1-5
ALTER TABLE feedback ADD CONSTRAINT chk_rating_range 
  CHECK (rating >= 1 AND rating <= 5);

-- Ensure commission rate is reasonable
ALTER TABLE companies ADD CONSTRAINT chk_commission_rate 
  CHECK (commission_rate >= 0 AND commission_rate <= 30);

-- Ensure job dates are logical
ALTER TABLE jobs ADD CONSTRAINT chk_job_dates 
  CHECK (end_date >= start_date);

-- Ensure shift times are logical
ALTER TABLE assignments ADD CONSTRAINT chk_shift_times 
  CHECK (shift_end_time > shift_start_time);

-- Ensure payment amounts are positive
ALTER TABLE payments ADD CONSTRAINT chk_payment_amount 
  CHECK (amount > 0);

-- Ensure refund doesn't exceed payment
ALTER TABLE payments ADD CONSTRAINT chk_refund_amount 
  CHECK (refund_amount <= amount);
```

### Unique Constraints (Beyond Primary Keys)
```sql
-- Prevent duplicate active assignments for same caregiver at same time
CREATE UNIQUE INDEX idx_unique_active_assignment 
ON assignments(caregiver_id, job_id) 
WHERE status = 'active';

-- Prevent duplicate feedback for same job
ALTER TABLE feedback ADD CONSTRAINT uq_feedback_per_job 
  UNIQUE (job_id, reviewer_id, reviewee_id);

-- Prevent duplicate job applications
ALTER TABLE job_applications ADD CONSTRAINT uq_application_per_job 
  UNIQUE (marketplace_job_id, caregiver_id);

-- Ensure phone numbers are unique
ALTER TABLE users ADD CONSTRAINT uq_user_phone UNIQUE (phone);

-- Ensure transaction IDs are unique
ALTER TABLE payments ADD CONSTRAINT uq_transaction_id UNIQUE (transaction_id);
```

### Business Logic Triggers
```sql
-- Auto-update job status when all assignments complete
CREATE OR REPLACE FUNCTION update_job_status_on_assignment_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM assignments 
      WHERE job_id = NEW.job_id AND status != 'completed') = 0 
  THEN
    UPDATE jobs SET status = 'completed', updated_at = NOW() 
    WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assignment_completed
AFTER UPDATE OF status ON assignments
FOR EACH ROW 
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_job_status_on_assignment_completion();

-- Auto-increment applications_count on marketplace_jobs
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_jobs 
  SET applications_count = applications_count + 1 
  WHERE id = NEW.marketplace_job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_application_created
AFTER INSERT ON job_applications
FOR EACH ROW 
EXECUTE FUNCTION increment_application_count();

-- Log all data changes to audit_logs
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    actor_id, actor_role, action_type, entity_type, entity_id, 
    changes, timestamp
  ) VALUES (
    current_setting('app.current_user_id')::uuid,
    current_setting('app.current_user_role')::text,
    TG_OP || '.' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW)),
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to critical tables
CREATE TRIGGER trg_audit_jobs
AFTER INSERT OR UPDATE OR DELETE ON jobs
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER trg_audit_payments
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
```
````

---
## Database Optimization Strategies

### Indexing Strategy

**B-Tree Indexes** (default for most queries):
```sql
-- Frequently filtered columns
CREATE INDEX idx_job_status_dates ON jobs(status, start_date, end_date);
CREATE INDEX idx_caregiver_available_verified ON caregivers(is_available, is_verified);

-- Foreign keys (auto-indexed in PostgreSQL, but explicit is better)
CREATE INDEX idx_assignment_job_caregiver ON assignments(job_id, caregiver_id);
```

**GIN Indexes** (for JSONB and array columns):
```sql
-- Search within JSONB fields
CREATE INDEX idx_caregiver_skills_gin ON caregivers USING GIN(skills);
CREATE INDEX idx_package_inclusions_gin ON packages USING GIN(inclusions);
CREATE INDEX idx_health_record_metadata_gin ON health_records USING GIN(metadata);
```

**GiST Indexes** (for geospatial queries):
```sql
-- Proximity search for caregivers
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE INDEX idx_caregiver_location_gist ON caregivers 
  USING GIST(ll_to_earth(location_lat, location_lng));

-- Query: Find caregivers within 5km
SELECT * FROM caregivers 
WHERE earth_distance(
  ll_to_earth(location_lat, location_lng), 
  ll_to_earth(23.8103, 90.4125)  -- Target location
) < 5000;  -- 5000 meters
```

**Partial Indexes** (for frequently queried subsets):
```sql
-- Index only active jobs
CREATE INDEX idx_active_jobs ON jobs(start_date, end_date) 
WHERE status = 'active';

-- Index only verified caregivers
CREATE INDEX idx_verified_caregivers ON caregivers(rating_avg DESC) 
WHERE is_verified = true AND is_available = true;
```

**Composite Indexes** (for multi-column queries):
```sql
-- Guardian views their patients' jobs
CREATE INDEX idx_job_guardian_status ON jobs(guardian_id, status, start_date DESC);

-- Company filters caregivers by skills and rating
CREATE INDEX idx_caregiver_company_rating ON caregivers(company_id, rating_avg DESC, is_available);
```

---

### Query Optimization Examples

**1. Caregiver Search with Filters**:
```sql
-- Inefficient (full table scan)
SELECT * FROM caregivers 
WHERE skills @> '["medication_mgmt"]' 
  AND is_verified = true 
  AND rating_avg >= 4.0;

-- Optimized (uses indexes)
SELECT c.* FROM caregivers c
WHERE c.is_verified = true 
  AND c.is_available = true
  AND c.rating_avg >= 4.0
  AND c.skills @> '["medication_mgmt"]'::jsonb
ORDER BY c.rating_avg DESC
LIMIT 20;

-- With GIN index on skills, this becomes fast even with 100K+ caregivers
```

**2. Job History for Guardian (Pagination)**:
```sql
-- Cursor-based pagination (better for large datasets)
SELECT * FROM jobs 
WHERE guardian_id = ? 
  AND created_at < ?  -- cursor
ORDER BY created_at DESC 
LIMIT 20;

-- Uses: idx_job_guardian_status
```

**3. Aggregate Ratings Update (Triggered)**:
```sql
-- Instead of calculating on every query, use triggers
CREATE OR REPLACE FUNCTION update_caregiver_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE caregivers SET
    rating_avg = (SELECT AVG(rating) FROM feedback WHERE reviewee_id = NEW.reviewee_id),
    rating_count = (SELECT COUNT(*) FROM feedback WHERE reviewee_id = NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_inserted
AFTER INSERT ON feedback
FOR EACH ROW EXECUTE FUNCTION update_caregiver_rating();
```

---

### Partitioning for Large Tables

**Care Logs** (grows rapidly):
```sql
-- Partition by month
CREATE TABLE care_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  -- other columns...
) PARTITION BY RANGE (timestamp);

-- Create partitions (can automate with cron)
CREATE TABLE care_logs_2025_01 PARTITION OF care_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE care_logs_2025_02 PARTITION OF care_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Queries automatically route to correct partition
SELECT * FROM care_logs 
WHERE timestamp >= '2025-01-15' AND timestamp < '2025-01-20';
```

**Audit Logs** (retention policy):
```sql
-- Partition by quarter
CREATE TABLE audit_logs_2025_q1 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

-- Drop old partitions (after 5 years)
DROP TABLE audit_logs_2020_q1;
```

---

### Materialized Views for Analytics

**1. Company Performance Dashboard**:
```sql
CREATE MATERIALIZED VIEW mv_company_stats AS
SELECT 
  c.id AS company_id,
  c.company_name,
  COUNT(DISTINCT cg.id) AS total_caregivers,
  COUNT(DISTINCT j.id) AS total_jobs,
  SUM(j.total_price) AS total_revenue,
  AVG(f.rating) AS avg_rating,
  COUNT(DISTINCT CASE WHEN j.status = 'active' THEN j.id END) AS active_jobs
FROM companies c
LEFT JOIN caregivers cg ON cg.company_id = c.id
LEFT JOIN jobs j ON j.company_id = c.id
LEFT JOIN feedback f ON f.reviewee_id = c.id AND f.reviewee_type = 'company'
GROUP BY c.id, c.company_name;

-- Refresh daily (via cron)
REFRESH MATERIALIZED VIEW mv_company_stats;

-- Query is instant
SELECT * FROM mv_company_stats WHERE company_id = ?;
```

**2. Caregiver Utilization Report**:
```sql
CREATE MATERIALIZED VIEW mv_caregiver_utilization AS
SELECT 
  cg.id AS caregiver_id,
  cg.name,
  COUNT(a.id) AS total_assignments,
  COUNT(CASE WHEN j.status = 'active' THEN 1 END) AS active_assignments,
  SUM(EXTRACT(EPOCH FROM (a.shift_end_time - a.shift_start_time)) / 3600) AS total_hours_scheduled,
  AVG(f.rating) AS avg_rating
FROM caregivers cg
LEFT JOIN assignments a ON a.caregiver_id = cg.id
LEFT JOIN jobs j ON j.id = a.job_id
LEFT JOIN feedback f ON f.reviewee_id = cg.id AND f.reviewee_type = 'caregiver'
GROUP BY cg.id, cg.name;
```

---

### Database Connection Pooling

**PgBouncer Configuration**:
```ini
[databases]
caregiver_db = host=localhost port=5432 dbname=caregiver

[pgbouncer]
pool_mode = transaction  # Best for stateless APIs
max_client_conn = 1000   # Max connections from app
default_pool_size = 25   # Connections per database
reserve_pool_size = 5    # Emergency connections
```

**Application Connection Settings** (NestJS/TypeORM):
```typescript
{
  type: 'postgres',
  host: 'pgbouncer-host',
  port: 6432,  // PgBouncer port, not PostgreSQL
  database: 'caregiver_db',
  poolSize: 20,  // App-level pool
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
}
```

---

### Backup & Disaster Recovery

**Automated Backups**:
```bash
#!/bin/bash
# Daily backup script (run via cron at 2 AM)

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="caregiver_db"

# Full database dump
pg_dump -U postgres -h localhost $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://caregiver-backups/daily/

# Delete local backups older than 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Keep only last 30 backups in S3 (lifecycle policy)
```

**Point-in-Time Recovery (PITR)**:
```sql
-- Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'aws s3 cp %p s3://caregiver-wal/%f'

-- Restore to specific time
pg_basebackup -D /var/lib/postgresql/data_restore -Ft -z -P
# Edit recovery.conf
recovery_target_time = '2025-01-15 14:30:00'
```

**Replication Setup** (High Availability):
```sql
-- Primary server: postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

-- Standby server: recovery.conf
standby_mode = on
primary_conninfo = 'host=primary_host port=5432 user=replicator password=xxx'
trigger_file = '/tmp/postgresql.trigger.5432'

-- Monitor replication lag
SELECT 
  client_addr, 
  state, 
  pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes 
FROM pg_stat_replication;
```

---

### Data Retention & Archival Policies

| Table | Hot Storage | Warm Storage | Cold Storage | Delete After |
|-------|-------------|--------------|--------------|--------------|
| **care_logs** | Last 3 months (PostgreSQL) | 3-12 months (Partition + S3) | 1-5 years (Glacier) | 5 years |
| **audit_logs** | Last 6 months | 6 months - 2 years | 2-5 years | 5 years |
| **notifications** | Last 1 month | - | - | 90 days |
| **payments** | All (no archival) | - | - | Never |
| **jobs** | Active + last 1 year | 1-5 years | - | Never (soft delete only) |

**Archival Script** (Move old care_logs to S3):
```sql
-- Export to CSV
COPY (
  SELECT * FROM care_logs 
  WHERE timestamp < NOW() - INTERVAL '3 months'
) TO '/tmp/care_logs_archive.csv' CSV HEADER;

-- Upload to S3
aws s3 cp /tmp/care_logs_archive.csv s3://caregiver-archive/care_logs/2024_q4.csv

-- Delete from database
DELETE FROM care_logs WHERE timestamp < NOW() - INTERVAL '3 months';
```

---

### Security: Row-Level Security (RLS)

**Example: Guardians can only see their own patients**:
```sql
-- Enable RLS on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY guardian_access_own_patients ON patients
  FOR ALL
  USING (guardian_id = current_setting('app.current_user_id')::uuid);

-- In application code (set session variable)
await db.query("SET app.current_user_id = $1", [userId]);
```

**Example: Caregivers can only view assigned jobs**:
```sql
CREATE POLICY caregiver_assigned_jobs ON jobs
  FOR SELECT
  USING (
    id IN (
      SELECT job_id FROM assignments 
      WHERE caregiver_id = current_setting('app.current_user_id')::uuid
    )
  );
```

---

### Database Monitoring Queries

**1. Slow Queries**:
```sql
-- Find queries taking >500ms
SELECT 
  query, 
  calls, 
  mean_exec_time, 
  max_exec_time 
FROM pg_stat_statements 
WHERE mean_exec_time > 500 
ORDER BY mean_exec_time DESC 
LIMIT 20;
```

**2. Table Bloat**:
```sql
-- Check for tables needing VACUUM
SELECT 
  schemaname, 
  tablename, 
  n_dead_tup, 
  n_live_tup 
FROM pg_stat_user_tables 
WHERE n_dead_tup > 10000 
ORDER BY n_dead_tup DESC;

-- Auto-vacuum settings in postgresql.conf
autovacuum = on
autovacuum_max_workers = 3
```

**3. Connection Stats**:
```sql
-- Current connections by state
SELECT state, COUNT(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Kill long-running queries (>10 minutes)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' 
  AND now() - query_start > INTERVAL '10 minutes';
```

**4. Index Usage**:
```sql
-- Find unused indexes (candidates for removal)
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  idx_scan 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
  AND indexname NOT LIKE '%_pkey';
```
````

---

## **ADD new section after all entity definitions**
````markdown
## Data Migration Strategy (Phase Transitions)

### Phase 1 → Phase 2 Migrations

**1. Add Marketplace Tables**:
```sql
-- Create new tables without downtime
CREATE TABLE marketplace_jobs (...);
CREATE TABLE job_applications (...);

-- Backfill existing jobs if needed
INSERT INTO marketplace_jobs (...)
SELECT ... FROM jobs WHERE ...;
```

**2. Schema Changes (Zero-Downtime)**:
```sql
-- Add new column (nullable first)
ALTER TABLE caregivers ADD COLUMN video_intro_url TEXT NULL;

-- Backfill data (batched)
UPDATE caregivers SET video_intro_url = 'default.mp4' 
WHERE id IN (SELECT id FROM caregivers LIMIT 1000);

-- Make NOT NULL after backfill
ALTER TABLE caregivers ALTER COLUMN video_intro_url SET NOT NULL;
```

**3. Data Type Changes**:
```sql
-- Step 1: Add new column
ALTER TABLE payments ADD COLUMN amount_new DECIMAL(12,2);

-- Step 2: Dual-write (app writes to both)
UPDATE payments SET amount_new = amount::decimal;

-- Step 3: Switch reads to new column (deploy app)

-- Step 4: Drop old column
ALTER TABLE payments DROP COLUMN amount;
ALTER TABLE payments RENAME COLUMN amount_new TO amount;
```

---

### Testing Data (Seed Scripts)

**Development/Staging Seeds**:
```sql
-- Insert test users
INSERT INTO users (id, role, phone, email, name, password_hash, language, kyc_status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'guardian', '+8801712345678', 'guardian@test.com', 'Test Guardian', '$2b$10$...', 'en', 'verified'),
  ('22222222-2222-2222-2222-222222222222', 'caregiver', '+8801812345678', 'caregiver@test.com', 'Test Caregiver', '$2b$10$...', 'bn', 'verified'),
  ('33333333-3333-3333-3333-333333333333', 'company', '+8801912345678', 'company@test.com', 'Test Company', '$2b$10$...', 'en', 'verified');

-- Insert test company
INSERT INTO companies (id, user_id, company_name, trade_license, contact_person, contact_phone, address, is_verified)
VALUES ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Care Solutions Ltd', 'TL123456', 'John Doe', '+8801912345678', 'Gulshan-2, Dhaka', true);

-- Insert test caregiver
INSERT INTO caregivers (id, user_id, company_id, nid, date_of_birth, gender, address, skills, is_verified)
VALUES ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '1234567890123', '1985-05-15', 'female', 'Uttara, Dhaka', '["medication_mgmt", "mobility_assist"]'::jsonb, true);

-- Faker.js script for bulk test data (Node.js)
const faker = require('faker');
for (let i = 0; i < 1000; i++) {
  // Generate 1000 caregivers with realistic data
  console.log(`INSERT INTO caregivers (...) VALUES ('${faker.datatype.uuid()}', ...);`);
}
```

---

## Data Privacy & GDPR-Style Compliance

### Personal Data Inventory

| Table | Personal Data Fields | Sensitivity | Retention |
|-------|---------------------|-------------|-----------|
| **users** | phone, email, name | Medium | Active account + 1 year |
| **caregivers** | nid, photo_url, address, location | High | Active + 5 years |
| **patients** | name, dob, address, conditions | High | Active + 5 years (medical) |
| **health_records** | file_url, metadata | Critical | 5 years (legal requirement) |
| **care_logs** | notes, photo_urls | High | 5 years |
| **audit_logs** | ip_address, user_agent | Low | 2 years |

### Data Subject Rights Implementation

**1. Right to Access (Data Export)**:
```sql
-- Guardian requests all their data
WITH patient_ids AS (
  SELECT id FROM patients WHERE guardian_id = ?
),
job_ids AS (
  SELECT id FROM jobs WHERE guardian_id = ? OR patient_id IN (SELECT id FROM patient_ids)
)
SELECT 
  'users' AS table_name, row_to_json(u.*) AS data FROM users u WHERE id = ?
UNION ALL
SELECT 'patients', row_to_json(p.*) FROM patients p WHERE guardian_id = ?
UNION ALL
SELECT 'jobs', row_to_json(j.*) FROM jobs j WHERE id IN (SELECT id FROM job_ids)
-- ... continue for all related tables

-- Export as JSON and send to user
```

**2. Right to Erasure (Delete Account)**:
```sql
-- Soft delete with anonymization
BEGIN;

-- Anonymize personal data (keep for statistics)
UPDATE users SET
  phone = 'deleted_' || id,
  email = NULL,
  name = 'Deleted User',
  deleted_at = NOW()
WHERE id = ?;

UPDATE caregivers SET
  nid = 'REDACTED',
  photo_url = NULL,
  address = 'REDACTED',
  location_lat = NULL,
  location_lng = NULL
WHERE user_id = ?;

-- Delete sensitive health data (hard delete after consent period)
DELETE FROM health_records WHERE patient_id IN (SELECT id FROM patients WHERE guardian_id = ?);

COMMIT;
```

**3. Data Portability**:
```javascript
// Export in standard JSON format
{
  "user": {...},
  "patients": [...],
  "jobs": [...],
  "care_logs": [...],
  "payments": [...],
  "exported_at": "2025-01-15T10:30:00Z",
  "format_version": "1.0"
}
```

### Encryption at Rest

**Sensitive Fields Encryption** (Application-level):
```javascript
// Using crypto library
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;  // 32 bytes

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Before saving
caregiver.nid = encrypt(nidValue);

// Before returning
caregiver.nid = decrypt(caregiver.nid);
```

**Database-Level Encryption** (PostgreSQL):
```sql
-- Enable transparent data encryption (TDE) in postgresql.conf
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'

-- Encrypt specific columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Store encrypted
INSERT INTO caregivers (nid_encrypted) 
VALUES (pgp_sym_encrypt('1234567890123', 'encryption-key'));

-- Retrieve decrypted
SELECT pgp_sym_decrypt(nid_encrypted::bytea, 'encryption-key') FROM caregivers;
```
````

---

## Database Size Estimates (Year 1)

| Table | Est. Records | Growth Rate | Storage (GB) | Notes |
|-------|--------------|-------------|--------------|-------|
| **users** | 15,000 | Medium | 0.05 | Companies, caregivers, guardians |
| **companies** | 100 | Low | 0.001 | Year 1 target |
| **caregivers** | 10,000 | High | 0.5 | Includes photos/docs |
| **patients** | 20,000 | High | 0.2 | Multiple per guardian |
| **health_records** | 50,000 | High | 2.0 | PDF/images stored in S3 |
| **packages** | 500 | Low | 0.001 | Multiple per company |
| **jobs** | 100,000 | High | 1.0 | Primary growth driver |
| **assignments** | 150,000 | High | 0.5 | Primary + backup |
| **care_logs** | 5,000,000 | Very High | 10.0 | Daily logs per job |
| **payments** | 100,000 | High | 0.5 | One per job |
| **feedback** | 80,000 | High | 0.3 | 80% jobs get rated |
| **audit_logs** | 2,000,000 | Very High | 5.0 | All actions tracked |
| **notifications** | 3,000,000 | Very High | 1.0 | Pruned after 90 days |
| **disputes** | 2,000 | Low | 0.01 | ~2% of jobs |
| **service_zones** | 500 | Low | 0.001 | Multiple per company |
| **marketplace_jobs** | 10,000 | Medium (Phase 2) | 0.1 | |
| **job_applications** | 50,000 | High (Phase 2) | 0.2 | |
| **TOTAL** | **10.9M+** | | **~21 GB** | Excluding S3 files |

**S3 Storage** (files): ~500 GB (photos, documents, PDFs)

**Scaling Considerations**:
- **care_logs** will be the largest table → **partition by month**
- **audit_logs** second largest → **partition by quarter**
- **notifications** purged after 90 days → **auto-cleanup job**
- Total database size Year 3: **~150 GB** (with partitioning & archival)

---

## Index Size Impact

**Rule of Thumb**: Indexes add **30-50%** overhead to table size

| Table | Indexes | Est. Index Size | Total (Table + Indexes) |
|-------|---------|-----------------|-------------------------|
| **care_logs** | 5 indexes | +3 GB | 13 GB |
| **audit_logs** | 4 indexes | +1.5 GB | 6.5 GB |
| **caregivers** | 6 indexes (incl. GIN, GiST) | +0.3 GB | 0.8 GB |

**Total DB Size with Indexes**: **~30 GB** (Year 1)

---

## Performance Baselines (Target)

| Operation | Target Latency | Max Acceptable | Notes |
|-----------|----------------|----------------|-------|
| **User login** | <200ms | <500ms | Includes JWT generation |
| **Caregiver search** | <300ms | <500ms | With filters + geospatial |
| **Job creation** | <500ms | <1s | Includes payment processing |
| **Care log insert** | <100ms | <200ms | High frequency operation |
| **Dashboard load** | <1s | <2s | Aggregated data + charts |
| **Payment webhook** | <200ms | <500ms | Critical for gateway timeout |
| **Report generation** | <3s | <5s | PDF generation |
| **Bulk export (1000 rows)** | <2s | <5s | CSV download |

**Load Testing Targets**:
- **Concurrent Users**: 10K (Year 1) → 50K (Year 3)
- **Requests/Second**: 1K (Year 1) → 10K (Year 3)
- **Database Connections**: 100 (pooled) → 500 (with read replicas)

---

## Disaster Recovery Matrix

| Scenario | RTO | RPO | Recovery Procedure |
|----------|-----|-----|-------------------|
| **Database Corruption** | 2 hours | 1 hour | Restore from latest backup + replay WAL |
| **Data Center Failure** | 4 hours | 15 minutes | Failover to standby replica (different AZ) |
| **Accidental DELETE** | 30 minutes | 1 hour | Point-in-time recovery (PITR) |
| **Ransomware/Malware** | 6 hours | 24 hours | Restore from immutable S3 backup |
| **Region-Wide Outage** | 8 hours | 1 hour | Cross-region replica promotion |

**Testing Schedule**:
- **Backup Restore**: Monthly
- **Failover Drill**: Quarterly
- **Full DR Simulation**: Annually
````

---



## **Summary of All Changes**

1. **Added Database Design Principles** at the top
2. **Expanded all core entities** with complete field definitions, types, constraints
3. **Added detailed JSONB schemas** for flexible fields (availability_calendar, metadata)
4. **Added comprehensive indexing strategies** (B-Tree, GIN, GiST, partial, composite)
5. **Added new entities**: `Dispute`, `Notification`, `MarketplaceJob`, `JobApplication`
6. **Expanded relationships** with cardinality, cascade rules
7. **Added optimization strategies**: partitioning, materialized views, connection pooling
8. **Added backup & disaster recovery** procedures
9. **Added data retention policies** with archival workflows
10. **Added Row-Level Security** examples
11. **Added monitoring queries** for performance tracking
12. **Added migration strategy** for zero-downtime schema changes
13. **Added data privacy compliance** (GDPR-style rights, encryption)

This transforms the data model from a **basic schema outline** into a **production-grade database design document** with security, scalability, and compliance built in.


### ER Diagram (Conceptual)
```
[Company]---(has)---[Caregiver]
   |                     |
   |                     |
  (offers)             (assigned to)
   |                     |
 [Package]---(links)---[Job]---(handled by)---[Caregiver]
```


## ER Diagram (Mermaid)
````mermaid
erDiagram
    USER {
        uuid id PK
        enum role
        varchar phone UK
        varchar email UK
        varchar name
        enum kyc_status
    }
    
    COMPANY {
        uuid id PK
        uuid user_id FK
        varchar company_name
        varchar trade_license UK
        enum subscription_tier
        decimal rating_avg
        boolean is_verified
    }
    
    CAREGIVER {
        uuid id PK
        uuid user_id FK
        uuid company_id FK
        varchar nid UK
        jsonb skills
        jsonb certifications
        decimal rating_avg
        boolean is_verified
    }
    
    PATIENT {
        uuid id PK
        uuid user_id FK
        uuid guardian_id FK
        varchar name
        date date_of_birth
        jsonb primary_conditions
        enum mobility_level
    }
    
    HEALTH_RECORD {
        uuid id PK
        uuid patient_id FK
        enum record_type
        varchar title
        text file_url
        jsonb metadata
    }
    
    PACKAGE {
        uuid id PK
        uuid company_id FK
        varchar name
        enum category
        decimal price
        int duration_days
        jsonb inclusions
    }
    
    JOB {
        uuid id PK
        uuid package_id FK
        uuid patient_id FK
        uuid company_id FK
        uuid guardian_id FK
        date start_date
        date end_date
        enum status
        decimal total_price
    }
    
    ASSIGNMENT {
        uuid id PK
        uuid job_id FK
        uuid caregiver_id FK
        enum role
        time shift_start_time
        time shift_end_time
        jsonb days_of_week
    }
    
    CARE_LOG {
        uuid id PK
        uuid job_id FK
        uuid caregiver_id FK
        uuid patient_id FK
        enum log_type
        timestamp timestamp
        jsonb data
    }
    
    PAYMENT {
        uuid id PK
        uuid job_id FK
        uuid payer_id FK
        decimal amount
        enum method
        varchar transaction_id UK
        enum status
        varchar invoice_number UK
    }
    
    FEEDBACK {
        uuid id PK
        uuid job_id FK
        uuid reviewer_id FK
        uuid reviewee_id FK
        enum reviewee_type
        int rating
        jsonb tags
        text comments
    }
    
    AUDIT_LOG {
        uuid id PK
        uuid actor_id FK
        enum actor_role
        varchar action_type
        varchar entity_type
        uuid entity_id
        jsonb changes
        timestamp timestamp
    }
    
    SERVICE_ZONE {
        uuid id PK
        uuid company_id FK
        varchar zone_name
        varchar region_code
        jsonb boundary_geojson
    }
    
    DISPUTE {
        uuid id PK
        uuid job_id FK
        uuid raised_by FK
        uuid against FK
        enum dispute_type
        enum status
        uuid assigned_moderator FK
    }
    
    NOTIFICATION {
        uuid id PK
        uuid user_id FK
        enum type
        varchar channel
        text body
        enum status
    }
    
    MARKETPLACE_JOB {
        uuid id PK
        uuid company_id FK
        varchar title
        jsonb required_skills
        date start_date
        enum status
    }
    
    JOB_APPLICATION {
        uuid id PK
        uuid marketplace_job_id FK
        uuid caregiver_id FK
        text cover_letter
        enum status
    }

    %% Relationships
    USER ||--o{ COMPANY : "owns"
    USER ||--o{ PATIENT : "manages_as_guardian"
    USER ||--o{ CAREGIVER : "has_account"
    
    COMPANY ||--o{ CAREGIVER : "employs"
    COMPANY ||--o{ PACKAGE : "offers"
    COMPANY ||--o{ SERVICE_ZONE : "services"
    COMPANY ||--o{ MARKETPLACE_JOB : "posts"
    
    CAREGIVER ||--o{ ASSIGNMENT : "assigned_to"
    CAREGIVER ||--o{ CARE_LOG : "creates"
    CAREGIVER ||--o{ JOB_APPLICATION : "applies_with"
    
    PATIENT ||--o{ JOB : "receives_care"
    PATIENT ||--o{ HEALTH_RECORD : "has_records"
    PATIENT ||--o{ CARE_LOG : "receives_logs"
    
    PACKAGE ||--o{ JOB : "creates"
    
    JOB ||--o{ ASSIGNMENT : "has_assignments"
    JOB ||--o{ CARE_LOG : "tracks"
    JOB ||--|| PAYMENT : "billed_by"
    JOB ||--o{ FEEDBACK : "receives"
    JOB ||--o{ DISPUTE : "subject_of"
    
    USER ||--o{ FEEDBACK : "gives"
    USER ||--o{ FEEDBACK : "receives"
    USER ||--o{ AUDIT_LOG : "performs"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ DISPUTE : "raises"
    USER ||--o{ DISPUTE : "moderates"
    
    MARKETPLACE_JOB ||--o{ JOB_APPLICATION : "receives"
````

---

### 3. **ADD: Missing ASCII diagram update**

**REPLACE the ASCII Diagram** with this more complete version:
````markdown
## ASCII Diagram (Comprehensive View)
````
                                    ┌──────────┐
                                    │   USER   │
                                    └─────┬────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
              ┌──────────┐          ┌──────────┐         ┌──────────┐
              │ COMPANY  │          │ PATIENT  │         │CAREGIVER │
              └────┬─────┘          └────┬─────┘         └────┬─────┘
                   │                     │                     │
         ┌─────────┼──────────┐          │                     │
         │         │          │          │                     │
         ▼         ▼          ▼          │                     │
    ┌────────┐┌────────┐┌────────┐      │                     │
    │PACKAGE ││SERVICE ││ MKTP   │      │                     │
    │        ││ ZONE   ││ JOB    │      │                     │
    └───┬────┘└────────┘└───┬────┘      │                     │
        │                   │           │                     │
        │                   └───────────┼─────────────────────┤
        │                               │                     │
        └───────────────┐               │                     │
                        ▼               ▼                     ▼
                    ┌────────────────────────────────────────────┐
                    │                  JOB                       │
                    └───┬─────────────────┬──────────────────┬──┘
                        │                 │                  │
            ┌───────────┼─────────────┐   │                  │
            ▼           ▼             ▼   ▼                  ▼
      ┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
      │ASSIGNMENT││ PAYMENT  ││ CARE_LOG ││ FEEDBACK ││ DISPUTE  │
      └──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
                                                             │
                                                             ▼
                                                      ┌──────────┐
                                                      │MODERATOR │
                                                      └──────────┘

Supporting Tables:
  • HEALTH_RECORD → linked to PATIENT
  • NOTIFICATION → linked to USER
  • AUDIT_LOG → tracks all entity changes
  • JOB_APPLICATION → linked to MARKETPLACE_JOB + CAREGIVER
````
````

---

### 4. **ADD: Summary statistics table**

**ADD this at the very end** (after the Data Privacy section):
````markdown
---

## Database Size Estimates (Year 1)

| Table | Est. Records | Growth Rate | Storage (GB) | Notes |
|-------|--------------|-------------|--------------|-------|
| **users** | 15,000 | Medium | 0.05 | Companies, caregivers, guardians |
| **companies** | 100 | Low | 0.001 | Year 1 target |
| **caregivers** | 10,000 | High | 0.5 | Includes photos/docs |
| **patients** | 20,000 | High | 0.2 | Multiple per guardian |
| **health_records** | 50,000 | High | 2.0 | PDF/images stored in S3 |
| **packages** | 500 | Low | 0.001 | Multiple per company |
| **jobs** | 100,000 | High | 1.0 | Primary growth driver |
| **assignments** | 150,000 | High | 0.5 | Primary + backup |
| **care_logs** | 5,000,000 | Very High | 10.0 | Daily logs per job |
| **payments** | 100,000 | High | 0.5 | One per job |
| **feedback** | 80,000 | High | 0.3 | 80% jobs get rated |
| **audit_logs** | 2,000,000 | Very High | 5.0 | All actions tracked |
| **notifications** | 3,000,000 | Very High | 1.0 | Pruned after 90 days |
| **disputes** | 2,000 | Low | 0.01 | ~2% of jobs |
| **service_zones** | 500 | Low | 0.001 | Multiple per company |
| **marketplace_jobs** | 10,000 | Medium (Phase 2) | 0.1 | |
| **job_applications** | 50,000 | High (Phase 2) | 0.2 | |
| **TOTAL** | **10.9M+** | | **~21 GB** | Excluding S3 files |

**S3 Storage** (files): ~500 GB (photos, documents, PDFs)

**Scaling Considerations**:
- **care_logs** will be the largest table → **partition by month**
- **audit_logs** second largest → **partition by quarter**
- **notifications** purged after 90 days → **auto-cleanup job**
- Total database size Year 3: **~150 GB** (with partitioning & archival)

---

## Index Size Impact

**Rule of Thumb**: Indexes add **30-50%** overhead to table size

| Table | Indexes | Est. Index Size | Total (Table + Indexes) |
|-------|---------|-----------------|-------------------------|
| **care_logs** | 5 indexes | +3 GB | 13 GB |
| **audit_logs** | 4 indexes | +1.5 GB | 6.5 GB |
| **caregivers** | 6 indexes (incl. GIN, GiST) | +0.3 GB | 0.8 GB |

**Total DB Size with Indexes**: **~30 GB** (Year 1)

---

## Performance Baselines (Target)

| Operation | Target Latency | Max Acceptable | Notes |
|-----------|----------------|----------------|-------|
| **User login** | <200ms | <500ms | Includes JWT generation |
| **Caregiver search** | <300ms | <500ms | With filters + geospatial |
| **Job creation** | <500ms | <1s | Includes payment processing |
| **Care log insert** | <100ms | <200ms | High frequency operation |
| **Dashboard load** | <1s | <2s | Aggregated data + charts |
| **Payment webhook** | <200ms | <500ms | Critical for gateway timeout |
| **Report generation** | <3s | <5s | PDF generation |
| **Bulk export (1000 rows)** | <2s | <5s | CSV download |

**Load Testing Targets**:
- **Concurrent Users**: 10K (Year 1) → 50K (Year 3)
- **Requests/Second**: 1K (Year 1) → 10K (Year 3)
- **Database Connections**: 100 (pooled) → 500 (with read replicas)

---

## Disaster Recovery Matrix

| Scenario | RTO | RPO | Recovery Procedure |
|----------|-----|-----|-------------------|
| **Database Corruption** | 2 hours | 1 hour | Restore from latest backup + replay WAL |
| **Data Center Failure** | 4 hours | 15 minutes | Failover to standby replica (different AZ) |
| **Accidental DELETE** | 30 minutes | 1 hour | Point-in-time recovery (PITR) |
| **Ransomware/Malware** | 6 hours | 24 hours | Restore from immutable S3 backup |
| **Region-Wide Outage** | 8 hours | 1 hour | Cross-region replica promotion |

**Testing Schedule**:
- **Backup Restore**: Monthly
- **Failover Drill**: Quarterly
- **Full DR Simulation**: Annually
````

---

### 5. **ADD: Missing constraint documentation**

**ADD this section before "Database Optimization Strategies"**:
````markdown
## Database Constraints & Business Rules

### Check Constraints
```sql
-- Ensure ratings are between 1-5
ALTER TABLE feedback ADD CONSTRAINT chk_rating_range 
  CHECK (rating >= 1 AND rating <= 5);

-- Ensure commission rate is reasonable
ALTER TABLE companies ADD CONSTRAINT chk_commission_rate 
  CHECK (commission_rate >= 0 AND commission_rate <= 30);

-- Ensure job dates are logical
ALTER TABLE jobs ADD CONSTRAINT chk_job_dates 
  CHECK (end_date >= start_date);

-- Ensure shift times are logical
ALTER TABLE assignments ADD CONSTRAINT chk_shift_times 
  CHECK (shift_end_time > shift_start_time);

-- Ensure payment amounts are positive
ALTER TABLE payments ADD CONSTRAINT chk_payment_amount 
  CHECK (amount > 0);

-- Ensure refund doesn't exceed payment
ALTER TABLE payments ADD CONSTRAINT chk_refund_amount 
  CHECK (refund_amount <= amount);
```

### Unique Constraints (Beyond Primary Keys)
```sql
-- Prevent duplicate active assignments for same caregiver at same time
CREATE UNIQUE INDEX idx_unique_active_assignment 
ON assignments(caregiver_id, job_id) 
WHERE status = 'active';

-- Prevent duplicate feedback for same job
ALTER TABLE feedback ADD CONSTRAINT uq_feedback_per_job 
  UNIQUE (job_id, reviewer_id, reviewee_id);

-- Prevent duplicate job applications
ALTER TABLE job_applications ADD CONSTRAINT uq_application_per_job 
  UNIQUE (marketplace_job_id, caregiver_id);

-- Ensure phone numbers are unique
ALTER TABLE users ADD CONSTRAINT uq_user_phone UNIQUE (phone);

-- Ensure transaction IDs are unique
ALTER TABLE payments ADD CONSTRAINT uq_transaction_id UNIQUE (transaction_id);
```

### Business Logic Triggers
```sql
-- Auto-update job status when all assignments complete
CREATE OR REPLACE FUNCTION update_job_status_on_assignment_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM assignments 
      WHERE job_id = NEW.job_id AND status != 'completed') = 0 
  THEN
    UPDATE jobs SET status = 'completed', updated_at = NOW() 
    WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assignment_completed
AFTER UPDATE OF status ON assignments
FOR EACH ROW 
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION update_job_status_on_assignment_completion();

-- Auto-increment applications_count on marketplace_jobs
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_jobs 
  SET applications_count = applications_count + 1 
  WHERE id = NEW.marketplace_job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_application_created
AFTER INSERT ON job_applications
FOR EACH ROW 
EXECUTE FUNCTION increment_application_count();

-- Log all data changes to audit_logs
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    actor_id, actor_role, action_type, entity_type, entity_id, 
    changes, timestamp
  ) VALUES (
    current_setting('app.current_user_id')::uuid,
    current_setting('app.current_user_role')::text,
    TG_OP || '.' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW)),
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to critical tables
CREATE TRIGGER trg_audit_jobs
AFTER INSERT OR UPDATE OR DELETE ON jobs
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER trg_audit_payments
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
```
````

---

