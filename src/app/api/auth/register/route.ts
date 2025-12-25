import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { hashPassword } from '@/lib/auth';
import { sendOTP } from '@/lib/notification-service';

// Bangladesh phone number validation
const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;

// Base user schema
const baseUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to terms and conditions'),
});

// Role-specific schemas
const guardianSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.GUARDIAN),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
});

const patientSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.PATIENT),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Please enter a valid date of birth'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
});

const caregiverSchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.CAREGIVER),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Caregivers must be between 18 and 65 years old'),
  nidNumber: z.string().min(10, 'NID number must be at least 10 characters'),
  experience: z.string().min(1, 'Experience is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  education: z.string().min(1, 'Education is required'),
  availability: z.object({
    fullTime: z.boolean(),
    partTime: z.boolean(),
    liveIn: z.boolean(),
    hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  }),
});

const companySchema = z.object({
  ...baseUserSchema.shape,
  role: z.literal(UserRole.COMPANY),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  tradeLicense: z.string().min(5, 'Trade license number is required'),
  companyAddress: z.string().min(5, 'Company address must be at least 5 characters'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  companyType: z.enum(['hospital', 'agency', 'individual', 'ngo']),
});

const registrationSchema = z.discriminatedUnion('role', [
  guardianSchema,
  patientSchema,
  caregiverSchema,
  companySchema,
]);

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return `+${digits}`;
  } else if (digits.startsWith('01')) {
    return `+880${digits}`;
  } else if (digits.length === 10 && digits.startsWith('1')) {
    return `+880${digits}`;
  }
  return phone;
}

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);
    
    const { role, phone, email, password } = validatedData;
    
    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { phone: formatPhoneNumber(phone) },
          ...(email && [{ email }]),
        ],
      },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone or email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user with role-specific data
    let user;
    const formattedPhone = formatPhoneNumber(phone);
    
    if (role === UserRole.COMPANY) {
      // Create user and company in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.users.create({
          data: {
            role,
            phone: formattedPhone,
            email,
            password_hash: passwordHash,
            name: validatedData.name,
            kyc_status: 'PENDING',
            is_active: true,
          },
        });
        
        await tx.companies.create({
          data: {
            userId: newUser.id,
            company_name: validatedData.companyName,
            trade_license: validatedData.trade_license,
            address: validatedData.companyAddress,
            contactPerson: validatedData.contactPerson,
            companyType: validatedData.companyType,
          },
        });
        
        return newUser;
      });
      user = result;
    } else if (role === UserRole.CAREGIVER) {
      // Create user and caregiver profile in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.users.create({
          data: {
            role,
            phone: formattedPhone,
            email,
            password_hash: passwordHash,
            name: validatedData.name,
            kyc_status: 'PENDING',
            is_active: true,
          },
        });
        
        await tx.caregivers.create({
          data: {
            userId: newUser.id,
            nid: validatedData.nidNumber,
            date_of_birth: new Date(validatedData.dateOfBirth),
            gender: 'OTHER', // Default value
            skills: validatedData.skills,
            experience_years: 0, // Default value, would be calculated from experience text
            is_verified: false,
            is_available: true,
          },
        });
        
        return newUser;
      });
      user = result;
    } else if (role === UserRole.GUARDIAN) {
      // Create guardian user
      user = await prisma.users.create({
        data: {
          role,
          phone: formattedPhone,
          email,
          passwordHash,
          name: validatedData.name,
          kyc_status: 'VERIFIED', // Guardians don't need verification
          is_active: true,
        },
      });
      
      // Create guardian profile
      await prisma.guardians.create({
        data: {
          userId: user.id,
          address: validatedData.address,
          emergencyContact: validatedData.emergencyContact,
        },
      });
    } else if (role === UserRole.PATIENT) {
      // Create patient user
      user = await prisma.users.create({
        data: {
          role,
          phone: formattedPhone,
          email,
          passwordHash,
          name: validatedData.name,
          kyc_status: 'VERIFIED', // Patients don't need verification
          is_active: true,
        },
      });
      
      // Create patient profile
      await prisma.patients.create({
        data: {
          userId: user.id,
          date_of_birth: new Date(validatedData.dateOfBirth),
          blood_group: validatedData.bloodGroup,
          allergies: validatedData.allergies,
          medicalConditions: validatedData.medicalConditions,
          gender: 'OTHER', // Default value
        },
      });
    }
    
    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store OTP in database (you might want to use Redis for this in production)
    await prisma.verification_codes.create({
      data: {
        userId: user.id,
        code: otp,
        type: 'PHONE_VERIFICATION',
        expiresAt: otpExpiry,
      },
    });
    
    // Send OTP via SMS (implement this based on your SMS service)
    try {
      await sendOTP(formattedPhone, otp);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // Continue with registration even if OTP fails
    }
    
    // Log user registration
    await prisma.audit_logs.create({
      data: {
        actor_id: user.id,
        actor_role: user.role,
        action_type: 'USER_REGISTERED',
        entity_type: 'USER',
        entity_id: user.id,
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown" || request.headers.get('x-forwarded-for') || 'Unknown',
        user_agent: request.headers.get('user-agent') || 'Unknown',
      },
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        role: user.role,
        phone: user.phone,
        email: user.email,
        name: user.name,
        kyc_status: user.kycStatus,
        is_active: user.is_active,
        created_at: user.createdAt,
      },
      message: 'Registration successful. Please verify your phone number.',
      requiresOTP: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}