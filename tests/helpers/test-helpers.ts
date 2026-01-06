import { PrismaClient } from "@prisma/client";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export interface CreateTestUserOptions {
  role: UserRole | string;
  email?: string;
  phone: string;
  name?: string;
  password?: string;
}

export interface CreateTestAgencyOptions {
  userId: string;
  agency_name: string;
  trade_license: string;
  contact_person?: string;
  contact_phone?: string;
  address?: string;
}

export interface CreateTestCaregiverOptions {
  userId: string;
  agency_id: string;
  name: string;
  nid?: string;
}

export async function createTestUser(options: CreateTestUserOptions) {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash(options.password || "Test@123", 12);

  try {
    return await prisma.users.create({
      data: {
        role: options.role as UserRole,
        phone: options.phone,
        email: options.email,
        name: options.name || "Test User",
        password_hash: hashedPassword,
        is_active: true,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function createTestAgency(options: CreateTestAgencyOptions) {
  const prisma = new PrismaClient();

  try {
    return await prisma.agencies.create({
      data: {
        id: `test-agency-${Date.now()}`,
        userId: options.userId,
        agency_name: options.agency_name,
        trade_license: options.trade_license,
        contact_person: options.contact_person || "Test Contact",
        contact_phone: options.contact_phone || "+1234567890",
        address: options.address || "Test Address",
        payout_method: "BANK_TRANSFER",
        payout_account: "TEST123456",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function createTestCaregiver(options: CreateTestCaregiverOptions) {
  const prisma = new PrismaClient();

  try {
    return await prisma.caregivers.create({
      data: {
        userId: options.userId,
        agency_id: options.agency_id,
        nid: options.nid || `NID${Date.now()}`,
        nid_url: "https://example.com/nid.jpg",
        photo_url: "https://example.com/photo.jpg",
        date_of_birth: new Date("1990-01-01"),
        gender: "MALE",
        address: "Test Address",
        skills: [],
        experience_years: 5,
        languages: ["en"],
        is_available: true,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export function generateTestToken(user: any): string {
  // Mock token generation for testing
  // In real implementation, use your actual JWT signing logic
  return "mock-jwt-token-for-testing";
}
