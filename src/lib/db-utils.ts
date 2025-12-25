import { prisma } from './db';
import { UserRole, KyCStatus, JobStatus, PaymentStatus } from '@prisma/client';

// User utilities
export async function createUser(data: {
  role: UserRole;
  phone: string;
  email?: string;
  password_hash: string;
  name?: string;
  language?: string;
}) {
  return await prisma.users.create({
    data: {
      ...data,
      language: data.language || 'en',
      kyc_status: KyCStatus.PENDING,
      is_active: true,
    },
  });
}

export async function getUserByPhone(phone: string) {
  return await prisma.users.findUnique({
    where: { phone },
  });
}

export async function getUserById(id: string) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export async function updateUserLastLogin(userId: string) {
  return await prisma.users.update({
    where: { id: user_id },
    data: { last_login_at: new Date() },
  });
}

export async function updateUserVerification(userId: string, isPhoneVerified: boolean) {
  return await prisma.users.update({
    where: { id: user_id },
    data: { isPhoneVerified },
  });
}

// Company utilities
export async function createCompany(data: {
  userId: string;
  company_name: string;
  trade_license: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  payoutMethod: string;
  payoutAccount: string;
  commissionRate?: number;
}) {
  return await prisma.companies.create({
    data: {
      ...data,
      commission_rate: data.commissionRate || 12.00,
      subscription_tier: 'STARTER',
      rating_avg: 0.0,
      rating_count: 0,
      is_verified: false,
    },
  });
}

export async function getCompanyByUserId(userId: string) {
  return await prisma.companies.findUnique({
    where: { user_id },
  });
}

// Caregiver utilities
export async function createCaregiver(data: {
  userId: string;
  company_id?: string;
  nid: string;
  nidUrl: string;
  photoUrl: string;
  date_of_birth: Date;
  gender: string;
  address: string;
  skills: any;
  experienceYears?: number;
}) {
  return await prisma.caregivers.create({
    data: {
      ...data,
      experience_years: data.experienceYears || 0,
      languages: ['bn'], // Default Bengali
      background_check_status: 'PENDING',
      rating_avg: 0.0,
      rating_count: 0,
      total_jobs_completed: 0,
      is_available: true,
      is_verified: false,
    },
  });
}

export async function getCaregiverByUserId(userId: string) {
  return await prisma.caregivers.findUnique({
    where: { user_id },
  });
}

// Patient utilities
export async function createPatient(data: {
  guardian_id: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryConditions?: any;
  allergies?: string;
}) {
  return await prisma.patients.create({
    data: {
      ...data,
      mobility_level: 'INDEPENDENT',
      cognitive_status: 'NORMAL',
      consent_data_sharing: false,
      consent_marketing: false,
    },
  });
}

export async function getPatientsByGuardian(guardianId: string) {
  return await prisma.patients.findMany({
    where: { guardian_id },
    orderBy: { created_at: 'desc' },
  });
}

// Job utilities
export async function createJob(data: {
  package_id: string;
  patient_id: string;
  company_id: string;
  guardian_id: string;
  start_date: Date;
  endDate: Date;
  totalPrice: number;
  commissionAmount: number;
  payoutAmount: number;
  specialInstructions?: string;
}) {
  return await prisma.jobs.create({
    data: {
      ...data,
      status: JobStatus.PENDING_ASSIGNMENT,
    },
  });
}

export async function getJobsByGuardian(guardianId: string) {
  return await prisma.jobs.findMany({
    where: { guardian_id },
    include: { patients: true,
      company: true,
      package: true,
      assignments: {
        include: { caregivers: {
            include: { users: true,
            },
          },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

// Payment utilities
export async function createPayment(data: {
  job_id: string;
  payer_id: string;
  amount: number;
  method: string;
  transaction_id: string;
  invoice_number: string;
}) {
  return await prisma.payments.create({
    data: {
      ...data,
      status: PaymentStatus.PENDING,
    },
  });
}

export async function getPaymentsByPayer(payerId: string) {
  return await prisma.payments.findMany({
    where: { payer_id },
    include: { jobs: {
        include: { patients: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

// Audit logging
export async function createAuditLog(data: {
  user_id?: string;
  action: string;
  metadata?: any;
}) {
  return await prisma.audit_logs.create({
    data,
  });
}

// Health check
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, message: 'Database connection failed', error };
  }
}