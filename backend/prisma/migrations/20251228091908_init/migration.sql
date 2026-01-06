-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "kyc_status" TEXT NOT NULL DEFAULT 'PENDING',
    "kyc_document_url" TEXT,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "last_login_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "company_id" TEXT,
    "agency_id" TEXT,
    CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agency_name" TEXT NOT NULL,
    "trade_license" TEXT NOT NULL,
    "trade_license_url" TEXT,
    "tin" TEXT,
    "contact_person" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT,
    "address" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "specializations" JSONB,
    "payout_method" TEXT NOT NULL,
    "payout_account" TEXT NOT NULL,
    "commission_rate" DECIMAL NOT NULL DEFAULT 12.00,
    "subscription_tier" TEXT NOT NULL DEFAULT 'STARTER',
    "subscription_expires_at" DATETIME,
    "rating_avg" DECIMAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_notes" TEXT,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "trade_license" TEXT NOT NULL,
    "trade_license_url" TEXT,
    "tin" TEXT,
    "contact_person" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_email" TEXT,
    "address" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "specializations" JSONB,
    "payout_method" TEXT NOT NULL,
    "payout_account" TEXT NOT NULL,
    "commission_rate" DECIMAL NOT NULL DEFAULT 12.00,
    "subscription_tier" TEXT NOT NULL DEFAULT 'STARTER',
    "subscription_expires_at" DATETIME,
    "rating_avg" DECIMAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_notes" TEXT,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "caregivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agency_id" TEXT,
    "company_id" TEXT,
    "nid" TEXT NOT NULL,
    "nid_url" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location_lat" DECIMAL,
    "location_lng" DECIMAL,
    "skills" JSONB NOT NULL,
    "certifications" JSONB,
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "languages" JSONB NOT NULL DEFAULT ["bn"],
    "availabilityCalendar" JSONB,
    "hourly_rate" DECIMAL,
    "background_check_status" TEXT NOT NULL DEFAULT 'PENDING',
    "background_check_date" DATETIME,
    "rating_avg" DECIMAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "total_jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "caregivers_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caregivers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "caregivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "guardian_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "blood_group" TEXT,
    "address" TEXT NOT NULL,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_phone" TEXT NOT NULL,
    "primaryConditions" JSONB,
    "allergies" TEXT,
    "mobility_level" TEXT NOT NULL DEFAULT 'INDEPENDENT',
    "cognitive_status" TEXT NOT NULL DEFAULT 'NORMAL',
    "photoUrl" TEXT,
    "consent_data_sharing" BOOLEAN NOT NULL DEFAULT false,
    "consent_marketing" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patients_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_number" TEXT NOT NULL,
    "invoice_type" TEXT NOT NULL,
    "issuer_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "job_id" TEXT,
    "amount" DECIMAL NOT NULL,
    "commission_fee" DECIMAL,
    "subscription_id" TEXT,
    "description" TEXT,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "paid_at" DATETIME,
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "reminder_sent" JSONB,
    "locked_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "account_lockouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "triggering_invoice_id" TEXT,
    "locked_features" JSONB NOT NULL,
    "active_features" JSONB NOT NULL,
    "locked_at" DATETIME NOT NULL,
    "unlocked_at" DATETIME,
    "unlocked_by" TEXT,
    "unlock_reason" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "account_lockouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "package_negotiations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package_id" TEXT NOT NULL,
    "guardian_id" TEXT NOT NULL,
    "original_price" DECIMAL NOT NULL,
    "proposed_price" DECIMAL,
    "proposed_changes" JSONB,
    "guardian_message" TEXT,
    "agency_response" TEXT,
    "counter_price" DECIMAL,
    "additional_services" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING_AGENCY_RESPONSE',
    "round_number" INTEGER NOT NULL DEFAULT 1,
    "parent_id" TEXT,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "package_negotiations_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "billing_cycle" TEXT NOT NULL,
    "current_period_start" DATETIME NOT NULL,
    "current_period_end" DATETIME NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "cancelled_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_steps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "step_type" TEXT NOT NULL,
    "step_order" INTEGER NOT NULL,
    "document_urls" JSONB,
    "moderator_id" TEXT,
    "moderator_notes" TEXT,
    "moderator_decision" DATETIME,
    "admin_id" TEXT,
    "admin_notes" TEXT,
    "admin_decision" TEXT NOT NULL DEFAULT 'PENDING',
    "admin_decided_at" DATETIME,
    "resubmit_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "verification_steps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participant_ids" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "last_message_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment_urls" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "address" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rating_avg" DECIMAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "shops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "image_urls" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "products_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total_amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "tracking_number" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orders_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agency_id" TEXT NOT NULL,
    "company_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "hours_per_day" INTEGER NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB,
    "caregiver_count" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "min_advance_days" INTEGER NOT NULL DEFAULT 2,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "packages_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "packages_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "package_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "company_id" TEXT,
    "agency_id" TEXT,
    "guardian_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    "total_price" DECIMAL NOT NULL,
    "commission_amount" DECIMAL NOT NULL,
    "payout_amount" DECIMAL NOT NULL,
    "special_instructions" TEXT,
    "completion_notes" TEXT,
    "cancelled_reason" TEXT,
    "cancelled_at" DATETIME,
    "cancelled_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "jobs_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "jobs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jobs_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PRIMARY',
    "shift_start_time" TEXT NOT NULL,
    "shift_end_time" TEXT NOT NULL,
    "days_of_week" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "replaced_by" TEXT,
    "replacement_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "assignments_replaced_by_fkey" FOREIGN KEY ("replaced_by") REFERENCES "caregivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "assignments_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "care_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "log_type" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "location_lat" DECIMAL,
    "location_lng" DECIMAL,
    "data" JSONB NOT NULL,
    "notes" TEXT,
    "photo_urls" JSONB,
    "guardian_notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vitals" JSONB,
    "activities" JSONB,
    CONSTRAINT "care_logs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "care_logs_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "care_logs_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "care_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "payer_id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "method" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "invoice_number" TEXT NOT NULL,
    "invoice_url" TEXT,
    "receipt_url" TEXT,
    "paid_at" DATETIME,
    "refund_amount" DECIMAL,
    "refund_reason" TEXT,
    "gatewayResponse" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_payer_id_fkey" FOREIGN KEY ("payer_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "escrows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payment_id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "fee" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'HELD',
    "released_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "escrows_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "raised_by" TEXT NOT NULL,
    "against" TEXT NOT NULL,
    "dispute_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence_urls" JSONB,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assigned_moderator" TEXT,
    "resolution" TEXT,
    "resolution_action" TEXT,
    "resolved_at" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "disputes_against_fkey" FOREIGN KEY ("against") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "disputes_raised_by_fkey" FOREIGN KEY ("raised_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "disputes_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "job_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "reviewee_type" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "tags" JSONB,
    "comments" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "company_response" TEXT,
    "responded_at" DATETIME,
    "flagged_inappropriate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "feedbacks_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT,
    "metadata" JSONB,
    "uploaded_by" TEXT,
    "valid_from" DATETIME,
    "valid_until" DATETIME,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "health_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sent_at" DATETIME,
    "delivered_at" DATETIME,
    "read_at" DATETIME,
    "error_message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_id" TEXT,
    "actor_role" TEXT,
    "action_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "changes" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "fcm_token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "app_version" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_zones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT,
    "agency_id" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "region_code" TEXT NOT NULL,
    "boundary_geojson" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "service_zones_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "service_zones_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "marketplace_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_id" TEXT,
    "agency_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "required_skills" JSONB NOT NULL,
    "start_date" DATETIME NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "hours_per_day" INTEGER NOT NULL,
    "offered_rate" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "applications_count" INTEGER NOT NULL DEFAULT 0,
    "filled_by" TEXT,
    "filled_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "marketplace_jobs_filled_by_fkey" FOREIGN KEY ("filled_by") REFERENCES "caregivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "marketplace_jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "marketplace_jobs_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketplace_job_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "reviewed_at" DATETIME,
    "review_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "job_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "job_applications_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregivers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "job_applications_marketplace_job_id_fkey" FOREIGN KEY ("marketplace_job_id") REFERENCES "marketplace_jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scheduled_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "task_type" TEXT NOT NULL,
    "job_id" TEXT,
    "execute_at" DATETIME NOT NULL,
    "payload" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending'
);

-- CreateTable
CREATE TABLE "escrow_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "escrow_ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "escrow_record_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "escrow_ledger_escrow_record_id_fkey" FOREIGN KEY ("escrow_record_id") REFERENCES "escrow_records" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provider_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploaded_by" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_kyc_status_idx" ON "users"("kyc_status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_userId_key" ON "agencies"("userId");

-- CreateIndex
CREATE INDEX "agencies_rating_avg_idx" ON "agencies"("rating_avg");

-- CreateIndex
CREATE INDEX "agencies_userId_idx" ON "agencies"("userId");

-- CreateIndex
CREATE INDEX "agencies_is_verified_idx" ON "agencies"("is_verified");

-- CreateIndex
CREATE UNIQUE INDEX "companies_userId_key" ON "companies"("userId");

-- CreateIndex
CREATE INDEX "companies_rating_avg_idx" ON "companies"("rating_avg");

-- CreateIndex
CREATE INDEX "companies_userId_idx" ON "companies"("userId");

-- CreateIndex
CREATE INDEX "companies_is_verified_idx" ON "companies"("is_verified");

-- CreateIndex
CREATE UNIQUE INDEX "caregivers_userId_key" ON "caregivers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "caregivers_nid_key" ON "caregivers"("nid");

-- CreateIndex
CREATE INDEX "caregivers_skills_idx" ON "caregivers"("skills");

-- CreateIndex
CREATE INDEX "caregivers_rating_avg_idx" ON "caregivers"("rating_avg");

-- CreateIndex
CREATE INDEX "caregivers_is_verified_is_available_idx" ON "caregivers"("is_verified", "is_available");

-- CreateIndex
CREATE INDEX "caregivers_agency_id_idx" ON "caregivers"("agency_id");

-- CreateIndex
CREATE INDEX "caregivers_company_id_idx" ON "caregivers"("company_id");

-- CreateIndex
CREATE INDEX "patients_primaryConditions_idx" ON "patients"("primaryConditions");

-- CreateIndex
CREATE INDEX "patients_guardian_id_idx" ON "patients"("guardian_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_recipient_id_status_idx" ON "invoices"("recipient_id", "status");

-- CreateIndex
CREATE INDEX "invoices_due_date_status_idx" ON "invoices"("due_date", "status");

-- CreateIndex
CREATE INDEX "account_lockouts_user_id_is_active_idx" ON "account_lockouts"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "package_negotiations_guardian_id_status_idx" ON "package_negotiations"("guardian_id", "status");

-- CreateIndex
CREATE INDEX "package_negotiations_package_id_idx" ON "package_negotiations"("package_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_is_active_idx" ON "subscriptions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "verification_steps_admin_decision_idx" ON "verification_steps"("admin_decision");

-- CreateIndex
CREATE UNIQUE INDEX "verification_steps_user_id_step_type_key" ON "verification_steps"("user_id", "step_type");

-- CreateIndex
CREATE INDEX "conversations_last_message_at_idx" ON "conversations"("last_message_at");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shops_user_id_key" ON "shops"("user_id");

-- CreateIndex
CREATE INDEX "shops_user_id_is_active_idx" ON "shops"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "products_shop_id_is_active_idx" ON "products"("shop_id", "is_active");

-- CreateIndex
CREATE INDEX "orders_shop_id_status_idx" ON "orders"("shop_id", "status");

-- CreateIndex
CREATE INDEX "packages_is_active_idx" ON "packages"("is_active");

-- CreateIndex
CREATE INDEX "packages_category_idx" ON "packages"("category");

-- CreateIndex
CREATE INDEX "packages_agency_id_idx" ON "packages"("agency_id");

-- CreateIndex
CREATE INDEX "packages_company_id_idx" ON "packages"("company_id");

-- CreateIndex
CREATE INDEX "jobs_guardian_id_idx" ON "jobs"("guardian_id");

-- CreateIndex
CREATE INDEX "jobs_start_date_end_date_idx" ON "jobs"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_company_id_idx" ON "jobs"("company_id");

-- CreateIndex
CREATE INDEX "jobs_agency_id_idx" ON "jobs"("agency_id");

-- CreateIndex
CREATE INDEX "jobs_patient_id_idx" ON "jobs"("patient_id");

-- CreateIndex
CREATE INDEX "assignments_caregiver_id_idx" ON "assignments"("caregiver_id");

-- CreateIndex
CREATE INDEX "assignments_job_id_idx" ON "assignments"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_job_id_caregiver_id_role_key" ON "assignments"("job_id", "caregiver_id", "role");

-- CreateIndex
CREATE INDEX "care_logs_log_type_idx" ON "care_logs"("log_type");

-- CreateIndex
CREATE INDEX "care_logs_timestamp_idx" ON "care_logs"("timestamp");

-- CreateIndex
CREATE INDEX "care_logs_patient_id_idx" ON "care_logs"("patient_id");

-- CreateIndex
CREATE INDEX "care_logs_caregiver_id_idx" ON "care_logs"("caregiver_id");

-- CreateIndex
CREATE INDEX "care_logs_job_id_idx" ON "care_logs"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoice_number_key" ON "payments"("invoice_number");

-- CreateIndex
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_job_id_idx" ON "payments"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "escrows_payment_id_key" ON "escrows"("payment_id");

-- CreateIndex
CREATE INDEX "escrows_status_idx" ON "escrows"("status");

-- CreateIndex
CREATE INDEX "escrows_payment_id_idx" ON "escrows"("payment_id");

-- CreateIndex
CREATE INDEX "disputes_assigned_moderator_idx" ON "disputes"("assigned_moderator");

-- CreateIndex
CREATE INDEX "disputes_status_idx" ON "disputes"("status");

-- CreateIndex
CREATE INDEX "disputes_job_id_idx" ON "disputes"("job_id");

-- CreateIndex
CREATE INDEX "feedbacks_is_public_rating_idx" ON "feedbacks"("is_public", "rating");

-- CreateIndex
CREATE INDEX "feedbacks_job_id_idx" ON "feedbacks"("job_id");

-- CreateIndex
CREATE INDEX "feedbacks_to_user_id_reviewee_type_idx" ON "feedbacks"("to_user_id", "reviewee_type");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_job_id_from_user_id_to_user_id_key" ON "feedbacks"("job_id", "from_user_id", "to_user_id");

-- CreateIndex
CREATE INDEX "health_records_record_type_idx" ON "health_records"("record_type");

-- CreateIndex
CREATE INDEX "health_records_patient_id_idx" ON "health_records"("patient_id");

-- CreateIndex
CREATE INDEX "notifications_sent_at_idx" ON "notifications"("sent_at");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_type_idx" ON "audit_logs"("action_type");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "verification_codes_userId_idx" ON "verification_codes"("userId");

-- CreateIndex
CREATE INDEX "verification_codes_code_idx" ON "verification_codes"("code");

-- CreateIndex
CREATE INDEX "verification_codes_expiresAt_idx" ON "verification_codes"("expiresAt");

-- CreateIndex
CREATE INDEX "verification_codes_isUsed_idx" ON "verification_codes"("isUsed");

-- CreateIndex
CREATE UNIQUE INDEX "user_devices_device_id_key" ON "user_devices"("device_id");

-- CreateIndex
CREATE INDEX "user_devices_fcm_token_idx" ON "user_devices"("fcm_token");

-- CreateIndex
CREATE INDEX "user_devices_user_id_is_active_idx" ON "user_devices"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "service_zones_region_code_idx" ON "service_zones"("region_code");

-- CreateIndex
CREATE INDEX "service_zones_company_id_idx" ON "service_zones"("company_id");

-- CreateIndex
CREATE INDEX "service_zones_agency_id_idx" ON "service_zones"("agency_id");

-- CreateIndex
CREATE INDEX "marketplace_jobs_start_date_idx" ON "marketplace_jobs"("start_date");

-- CreateIndex
CREATE INDEX "marketplace_jobs_status_idx" ON "marketplace_jobs"("status");

-- CreateIndex
CREATE INDEX "marketplace_jobs_company_id_idx" ON "marketplace_jobs"("company_id");

-- CreateIndex
CREATE INDEX "marketplace_jobs_agency_id_idx" ON "marketplace_jobs"("agency_id");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_caregiver_id_idx" ON "job_applications"("caregiver_id");

-- CreateIndex
CREATE INDEX "job_applications_marketplace_job_id_idx" ON "job_applications"("marketplace_job_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_marketplace_job_id_caregiver_id_key" ON "job_applications"("marketplace_job_id", "caregiver_id");

-- CreateIndex
CREATE INDEX "escrow_records_user_id_idx" ON "escrow_records"("user_id");

-- CreateIndex
CREATE INDEX "escrow_ledger_escrow_record_id_idx" ON "escrow_ledger"("escrow_record_id");

-- CreateIndex
CREATE INDEX "provider_transactions_provider_transaction_id_idx" ON "provider_transactions"("provider", "transaction_id");

-- CreateIndex
CREATE INDEX "files_uploaded_by_idx" ON "files"("uploaded_by");
