// User-related types
export interface User {
  id: string;
  role: UserRole;
  phone: string;
  email?: string;
  name: string;
  language: string;
  kycStatus: KyCStatus;
  kycDocumentUrl?: string;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  userId: string;
  companyName: string;
  tradeLicense: string;
  tradeLicenseUrl?: string;
  tin?: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  address: string;
  logoUrl?: string;
  description?: string;
  specializations?: any;
  payoutMethod: PayoutMethod;
  payoutAccount: string;
  commissionRate: number;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  verificationNotes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Caregiver {
  id: string;
  userId: string;
  companyId?: string;
  nid: string;
  nidUrl: string;
  photoUrl: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  locationLat?: number;
  locationLng?: number;
  skills: any;
  certifications?: any;
  experienceYears: number;
  languages: any;
  availabilityCalendar?: any;
  hourlyRate?: number;
  backgroundCheckStatus: BackgroundCheckStatus;
  backgroundCheckDate?: Date;
  ratingAvg: number;
  ratingCount: number;
  totalJobsCompleted: number;
  isAvailable: boolean;
  isVerified: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  userId?: string;
  guardianId: string;
  name: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryConditions?: any;
  allergies?: string;
  mobilityLevel: MobilityLevel;
  cognitiveStatus: CognitiveStatus;
  photoUrl?: string;
  consentDataSharing: boolean;
  consentMarketing: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Job-related types
export interface Package {
  id: string;
  companyId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  durationDays: number;
  hoursPerDay: number;
  inclusions: any;
  exclusions?: any;
  caregiverCount: number;
  isActive: boolean;
  minAdvanceDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  packageId: string;
  patientId: string;
  companyId: string;
  guardianId: string;
  startDate: Date;
  endDate: Date;
  status: JobStatus;
  totalPrice: number;
  commissionAmount: number;
  payoutAmount: number;
  specialInstructions?: string;
  completionNotes?: string;
  cancelledReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  jobId: string;
  caregiverId: string;
  role: AssignmentRole;
  shiftStartTime: string;
  shiftEndTime: string;
  daysOfWeek: any;
  status: AssignmentStatus;
  replacedBy?: string;
  replacementReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceJob {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  requiredSkills: any;
  startDate: Date;
  durationDays: number;
  hoursPerDay: number;
  offeredRate: number;
  status: MarketplaceJobStatus;
  applicationsCount: number;
  filledBy?: string;
  filledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  marketplaceJobId: string;
  caregiverId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
}

// Payment and financial types
export interface Payment {
  id: string;
  jobId: string;
  payerId: string;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  invoiceNumber: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  paidAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Care and health types
export interface CareLog {
  id: string;
  jobId: string;
  assignmentId: string;
  caregiverId: string;
  patientId: string;
  logType: LogType;
  timestamp: Date;
  locationLat?: number;
  locationLng?: number;
  data: any;
  notes?: string;
  photoUrls?: any;
  guardianNotified: boolean;
  createdAt: Date;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  recordType: RecordType;
  title: string;
  description?: string;
  fileUrl?: string;
  metadata?: any;
  uploadedBy?: string;
  validFrom?: Date;
  validUntil?: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Communication and feedback types
export interface Feedback {
  id: string;
  jobId: string;
  fromUserId: string;
  toUserId: string;
  revieweeType: string;
  rating: number;
  tags?: any;
  comments?: string;
  isPublic: boolean;
  companyResponse?: string;
  respondedAt?: Date;
  flaggedInappropriate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: string;
  title?: string;
  body: string;
  data?: any;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

// System types
export interface AuditLog {
  id: string;
  actorId?: string;
  actorRole?: string;
  actionType: string;
  entityType: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface Dispute {
  id: string;
  jobId: string;
  raisedBy: string;
  against: string;
  disputeType: DisputeType;
  description: string;
  evidenceUrls?: any;
  status: DisputeStatus;
  assignedModerator?: string;
  resolution?: string;
  resolutionAction?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceZone {
  id: string;
  companyId: string;
  zoneName: string;
  regionCode: string;
  boundaryGeojson?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth-related types
export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  role: UserRole;
  phone: string;
  email?: string;
  password: string;
  name: string;
  language?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  phone: string;
  email?: string;
  name: string;
  mfaEnabled?: boolean;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | undefined;
  };
}

// UI Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Import enum types from Prisma
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
  COMPANY = 'COMPANY',
  CAREGIVER = 'CAREGIVER',
  GUARDIAN = 'GUARDIAN',
  PATIENT = 'PATIENT',
}

export enum KyCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum JobStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum AssignmentRole {
  PRIMARY = 'PRIMARY',
  BACKUP = 'BACKUP',
}

export enum AssignmentStatus {
  ASSIGNED = 'ASSIGNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REPLACED = 'REPLACED',
}

export enum PaymentMethod {
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  FROZEN = 'FROZEN',
}

export enum PayoutMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}

export enum BackgroundCheckStatus {
  PENDING = 'PENDING',
  CLEARED = 'CLEARED',
  FLAGGED = 'FLAGGED',
}

export enum MobilityLevel {
  INDEPENDENT = 'INDEPENDENT',
  ASSISTED = 'ASSISTED',
  WHEELCHAIR = 'WHEELCHAIR',
  BEDRIDDEN = 'BEDRIDDEN',
}

export enum CognitiveStatus {
  NORMAL = 'NORMAL',
  MILD_IMPAIRMENT = 'MILD_IMPAIRMENT',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export enum LogType {
  CHECK_IN = 'CHECK_IN',
  VITALS = 'VITALS',
  MEDICATION = 'MEDICATION',
  MEAL = 'MEAL',
  ACTIVITY = 'ACTIVITY',
  INCIDENT = 'INCIDENT',
  CHECK_OUT = 'CHECK_OUT',
}

export enum RecordType {
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  DIAGNOSIS = 'DIAGNOSIS',
  MEDICATION_SCHEDULE = 'MEDICATION_SCHEDULE',
  NOTE = 'NOTE',
}

export enum NotificationType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
}

export enum DisputeType {
  PAYMENT = 'PAYMENT',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  NO_SHOW = 'NO_SHOW',
  OTHER = 'OTHER',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum MarketplaceJobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}