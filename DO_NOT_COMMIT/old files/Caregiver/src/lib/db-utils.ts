import { prisma } from './db';
import { UserRole, KyCStatus, JobStatus, PaymentStatus } from '@prisma/client';

// User utilities
export async function createUser(data: {
  role: UserRole;
  phone: string;
  email?: string;
  passwordHash: string;
  name?: string;
  language?: string;
}) {
  return await prisma.user.create({
    data: {
      ...data,
      language: data.language || 'en',
      kycStatus: KyCStatus.PENDING,
      isActive: true,
    },
  });
}

export async function getUserByPhone(phone: string) {
  return await prisma.user.findUnique({
    where: { phone },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUserLastLogin(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

export async function updateUserVerification(userId: string, isPhoneVerified: boolean) {
  return await prisma.user.update({
    where: { id: userId },
    data: { isPhoneVerified },
  });
}

// Company utilities
export async function createCompany(data: {
  userId: string;
  companyName: string;
  tradeLicense: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  payoutMethod: string;
  payoutAccount: string;
  commissionRate?: number;
}) {
  return await prisma.company.create({
    data: {
      ...data,
      commissionRate: data.commissionRate || 12.00,
      subscriptionTier: 'STARTER',
      ratingAvg: 0.0,
      ratingCount: 0,
      isVerified: false,
    },
  });
}

export async function getCompanyByUserId(userId: string) {
  return await prisma.company.findUnique({
    where: { userId },
  });
}

// Caregiver utilities
export async function createCaregiver(data: {
  userId: string;
  companyId?: string;
  nid: string;
  nidUrl: string;
  photoUrl: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  skills: any;
  experienceYears?: number;
}) {
  return await prisma.caregiver.create({
    data: {
      ...data,
      experienceYears: data.experienceYears || 0,
      languages: ['bn'], // Default Bengali
      backgroundCheckStatus: 'PENDING',
      ratingAvg: 0.0,
      ratingCount: 0,
      totalJobsCompleted: 0,
      isAvailable: true,
      isVerified: false,
    },
  });
}

export async function getCaregiverByUserId(userId: string) {
  return await prisma.caregiver.findUnique({
    where: { userId },
  });
}

// Patient utilities
export async function createPatient(data: {
  guardianId: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  primaryConditions?: any;
  allergies?: string;
}) {
  return await prisma.patient.create({
    data: {
      ...data,
      mobilityLevel: 'INDEPENDENT',
      cognitiveStatus: 'NORMAL',
      consentDataSharing: false,
      consentMarketing: false,
    },
  });
}

export async function getPatientsByGuardian(guardianId: string) {
  return await prisma.patient.findMany({
    where: { guardianId },
    orderBy: { createdAt: 'desc' },
  });
}

// Job utilities
export async function createJob(data: {
  packageId: string;
  patientId: string;
  companyId: string;
  guardianId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  commissionAmount: number;
  payoutAmount: number;
  specialInstructions?: string;
}) {
  return await prisma.job.create({
    data: {
      ...data,
      status: JobStatus.PENDING_ASSIGNMENT,
    },
  });
}

export async function getJobsByGuardian(guardianId: string) {
  return await prisma.job.findMany({
    where: { guardianId },
    include: {
      patient: true,
      company: true,
      package: true,
      assignments: {
        include: {
          caregiver: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Payment utilities
export async function createPayment(data: {
  jobId: string;
  payerId: string;
  amount: number;
  method: string;
  transactionId: string;
  invoiceNumber: string;
}) {
  return await prisma.payment.create({
    data: {
      ...data,
      status: PaymentStatus.PENDING,
    },
  });
}

export async function getPaymentsByPayer(payerId: string) {
  return await prisma.payment.findMany({
    where: { payerId },
    include: {
      job: {
        include: {
          patient: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Audit logging
export async function createAuditLog(data: {
  userId?: string;
  action: string;
  metadata?: any;
}) {
  return await prisma.auditLog.create({
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