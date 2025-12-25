-- Migration: Rename company_response field to agency_response
-- Date: 2025-12-25
-- Description: Complete the Company -> Agency renaming by updating database field name

-- Rename company_response to agency_response in feedbacks table
ALTER TABLE feedbacks 
RENAME COLUMN company_response TO agency_response;

-- Note: Other company_* fields were already renamed in previous migrations
-- This migration completes the final field rename in the feedbacks table
