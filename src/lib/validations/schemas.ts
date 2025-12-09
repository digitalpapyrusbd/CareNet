import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = z.object({
  role: z.enum(['COMPANY', 'CAREGIVER', 'GUARDIAN', 'PATIENT']),
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  language: z.string().default('en'),
});

export const userLoginSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().length(6, 'MFA code must be 6 digits').optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  language: z.string().optional(),
});

export const passwordResetSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
});

export const passwordResetConfirmSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const otpVerificationSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const sendOTPSchema = z.object({
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET', 'PHONE_CHANGE']),
});

// Company validation schemas
export const companyCreateSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  tradeLicense: z.string().min(1, 'Trade license is required'),
  tin: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  contactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  contactEmail: z.string().email('Invalid email format').optional(),
  address: z.string().min(5, 'Address is required'),
  payoutMethod: z.enum(['BANK_TRANSFER', 'BKASH', 'NAGAD']),
  payoutAccount: z.string().min(1, 'Payout account is required'),
  commissionRate: z.number().min(0).max(50).default(12.00),
});

export const companyUpdateSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  tradeLicense: z.string().min(1, 'Trade license is required').optional(),
  tin: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person name is required').optional(),
  contactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number').optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  address: z.string().min(5, 'Address is required').optional(),
  payoutMethod: z.enum(['BANK_TRANSFER', 'BKASH', 'NAGAD']).optional(),
  payoutAccount: z.string().min(1, 'Payout account is required').optional(),
  commissionRate: z.number().min(0).max(50).optional(),
  logoUrl: z.string().url('Invalid URL format').optional(),
  description: z.string().optional(),
  specializations: z.any().optional(),
});

// Caregiver validation schemas
export const caregiverCreateSchema = z.object({
  nid: z.string().min(10, 'NID is required'),
  nidUrl: z.string().url('Invalid NID URL format'),
  photoUrl: z.string().url('Invalid photo URL format'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Must be between 18 and 65 years old'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().min(5, 'Address is required'),
  skills: z.any().refine((skills) => {
    return Array.isArray(skills) && skills.length > 0;
  }, 'At least one skill is required'),
  certifications: z.any().optional(),
  experienceYears: z.number().min(0).max(50).default(0),
  languages: z.array(z.string()).default(['bn']),
  hourlyRate: z.number().min(0).optional(),
  companyId: z.string().optional(),
});

export const caregiverUpdateSchema = z.object({
  nid: z.string().min(10, 'NID is required').optional(),
  nidUrl: z.string().url('Invalid NID URL format').optional(),
  photoUrl: z.string().url('Invalid photo URL format').optional(),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Must be between 18 and 65 years old').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().min(5, 'Address is required').optional(),
  skills: z.any().refine((skills) => {
    return Array.isArray(skills) && skills.length > 0;
  }, 'At least one skill is required').optional(),
  certifications: z.any().optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  languages: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  availabilityCalendar: z.any().optional(),
  isAvailable: z.boolean().optional(),
});

// Patient validation schemas
export const patientCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    return dob < today;
  }, 'Date of birth must be in the past'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number'),
  primaryConditions: z.any().optional(),
  allergies: z.string().optional(),
  mobilityLevel: z.enum(['INDEPENDENT', 'ASSISTED', 'WHEELCHAIR', 'BEDRIDDEN']).default('INDEPENDENT'),
  cognitiveStatus: z.enum(['NORMAL', 'MILD_IMPAIRMENT', 'MODERATE', 'SEVERE']).default('NORMAL'),
  photoUrl: z.string().url('Invalid photo URL format').optional(),
  consentDataSharing: z.boolean().default(false),
  consentMarketing: z.boolean().default(false),
  userId: z.string().optional(),
  guardianId: z.string().optional(),
});

export const patientUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    return dob < today;
  }, 'Date of birth must be in the past').optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z.string().optional(),
  address: z.string().min(5, 'Address is required').optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required').optional(),
  emergencyContactPhone: z.string().regex(/^\+8801[3-9]\d{8}$/, 'Invalid Bangladeshi phone number').optional(),
  primaryConditions: z.any().optional(),
  allergies: z.string().optional(),
  mobilityLevel: z.enum(['INDEPENDENT', 'ASSISTED', 'WHEELCHAIR', 'BEDRIDDEN']).optional(),
  cognitiveStatus: z.enum(['NORMAL', 'MILD_IMPAIRMENT', 'MODERATE', 'SEVERE']).optional(),
  photoUrl: z.string().url('Invalid photo URL format').optional(),
  consentDataSharing: z.boolean().optional(),
  consentMarketing: z.boolean().optional(),
});

// Package validation schemas
export const packageCreateSchema = z.object({
  name: z.string().min(2, 'Package name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  durationDays: z.number().min(1, 'Duration must be at least 1 day'),
  hoursPerDay: z.number().min(1).max(24, 'Hours per day must be between 1 and 24'),
  inclusions: z.any().refine((inclusions) => {
    return Array.isArray(inclusions) && inclusions.length > 0;
  }, 'At least one inclusion is required'),
  exclusions: z.any().optional(),
  caregiverCount: z.number().min(1).max(10).default(1),
  minAdvanceDays: z.number().min(0).max(30).default(2),
  companyId: z.string().optional(),
});

export const packageUpdateSchema = z.object({
  name: z.string().min(2, 'Package name must be at least 2 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  durationDays: z.number().min(1, 'Duration must be at least 1 day').optional(),
  hoursPerDay: z.number().min(1).max(24, 'Hours per day must be between 1 and 24').optional(),
  inclusions: z.any().refine((inclusions) => {
    return Array.isArray(inclusions) && inclusions.length > 0;
  }, 'At least one inclusion is required').optional(),
  exclusions: z.any().optional(),
  caregiverCount: z.number().min(1).max(10).optional(),
  minAdvanceDays: z.number().min(0).max(30).optional(),
  isActive: z.boolean().optional(),
});

// Job validation schemas
export const jobCreateSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  companyId: z.string().min(1, 'Company ID is required'),
  startDate: z.string().refine((date) => {
    return new Date(date) > new Date();
  }, 'Start date must be in the future'),
  endDate: z.string().refine((date) => {
    return new Date(date) > new Date();
  }, 'End date must be in the future'),
  specialInstructions: z.string().optional(),
});

export const jobUpdateSchema = z.object({
  status: z.enum(['PENDING_ASSIGNMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED']).optional(),
  specialInstructions: z.string().optional(),
  completionNotes: z.string().optional(),
});

// Payment validation schemas
export const paymentCreateSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  method: z.enum(['BKASH', 'NAGAD', 'CARD', 'BANK_TRANSFER']),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
});

// Care log validation schemas
export const careLogCreateSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  logType: z.enum(['CHECK_IN', 'VITALS', 'MEDICATION', 'MEAL', 'ACTIVITY', 'INCIDENT', 'CHECK_OUT']),
  timestamp: z.string().refine((date) => {
    return !isNaN(Date.parse(date));
  }, 'Invalid timestamp format'),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLng: z.number().min(-180).max(180).optional(),
  data: z.any().refine((data) => {
    return data && typeof data === 'object';
  }, 'Log data is required'),
  notes: z.string().optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

// Feedback validation schemas
export const feedbackCreateSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  toUserId: z.string().min(1, 'User ID is required'),
  revieweeType: z.string().min(1, 'Reviewee type is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  tags: z.any().optional(),
  comments: z.string().optional(),
  isPublic: z.boolean().default(false),
});

// Health record validation schemas
export const healthRecordCreateSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  recordType: z.enum(['PRESCRIPTION', 'LAB_REPORT', 'DIAGNOSIS', 'MEDICATION_SCHEDULE', 'NOTE']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileUrl: z.string().url('Invalid file URL format').optional(),
  metadata: z.any().optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
});

export const healthRecordUpdateSchema = z.object({
  recordType: z.enum(['PRESCRIPTION', 'LAB_REPORT', 'DIAGNOSIS', 'MEDICATION_SCHEDULE', 'NOTE']).optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  fileUrl: z.string().url('Invalid file URL format').optional(),
  metadata: z.any().optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  isArchived: z.boolean().optional(),
});

// Marketplace job validation schemas
export const marketplaceJobCreateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  requiredSkills: z.any().refine((skills) => {
    return Array.isArray(skills) && skills.length > 0;
  }, 'At least one skill is required'),
  startDate: z.string().refine((date) => {
    return new Date(date) > new Date();
  }, 'Start date must be in the future'),
  durationDays: z.number().min(1, 'Duration must be at least 1 day'),
  hoursPerDay: z.number().min(1).max(24, 'Hours per day must be between 1 and 24'),
  offeredRate: z.number().min(0, 'Offered rate must be positive'),
  companyId: z.string().optional(),
});

export const marketplaceJobApplicationSchema = z.object({
  coverLetter: z.string().optional(),
});

// Notification validation schemas
export const notificationCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['SMS', 'EMAIL', 'PUSH', 'IN_APP']),
  channel: z.string().min(1, 'Channel is required'),
  title: z.string().optional(),
  body: z.string().min(1, 'Body is required'),
  data: z.any().optional(),
});

export const notificationUpdateSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  markAll: z.boolean().optional(),
});

// Pagination validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});