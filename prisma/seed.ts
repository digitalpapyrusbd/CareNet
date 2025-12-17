import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

// Use string literals for enum values
const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MODERATOR: 'MODERATOR',
  COMPANY: 'COMPANY',
  CAREGIVER: 'CAREGIVER',
  GUARDIAN: 'GUARDIAN',
  PATIENT: 'PATIENT'
} as const;

const KyCStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
} as const;

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const;

const SubscriptionTier = {
  STARTER: 'STARTER',
  GROWTH: 'GROWTH',
  ENTERPRISE: 'ENTERPRISE'
} as const;

const BackgroundCheckStatus = {
  PENDING: 'PENDING',
  CLEARED: 'CLEARED',
  FLAGGED: 'FLAGGED'
} as const;

const MobilityLevel = {
  INDEPENDENT: 'INDEPENDENT',
  ASSISTED: 'ASSISTED',
  WHEELCHAIR: 'WHEELCHAIR',
  BEDRIDDEN: 'BEDRIDDEN'
} as const;

const CognitiveStatus = {
  NORMAL: 'NORMAL',
  MILD_IMPAIRMENT: 'MILD_IMPAIRMENT',
  MODERATE: 'MODERATE',
  SEVERE: 'SEVERE'
} as const;

const AssignmentRole = {
  PRIMARY: 'PRIMARY',
  BACKUP: 'BACKUP'
} as const;

const AssignmentStatus = {
  ASSIGNED: 'ASSIGNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  REPLACED: 'REPLACED'
} as const;

const JobStatus = {
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DISPUTED: 'DISPUTED'
} as const;

const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  FROZEN: 'FROZEN'
} as const;

const PaymentMethod = {
  BKASH: 'BKASH',
  NAGAD: 'NAGAD',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER'
} as const;

const LogType = {
  CHECK_IN: 'CHECK_IN',
  VITALS: 'VITALS',
  MEDICATION: 'MEDICATION',
  MEAL: 'MEAL',
  ACTIVITY: 'ACTIVITY',
  INCIDENT: 'INCIDENT',
  CHECK_OUT: 'CHECK_OUT'
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.audit_logs.deleteMany();
  await prisma.scheduled_tasks.deleteMany();
  await prisma.disputes.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.feedbacks.deleteMany();
  await prisma.care_logs.deleteMany();
  await prisma.payments.deleteMany();
  await prisma.assignments.deleteMany();
  await prisma.jobs.deleteMany();
  await prisma.packages.deleteMany();
  await prisma.health_records.deleteMany();
  await prisma.patients.deleteMany();
  await prisma.caregivers.deleteMany();
  await prisma.companies.deleteMany();
  await prisma.users.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Shared password hash for demo accounts
  const demoPasswordHash = await hashPassword('Demo@123');

  // Create Super Admin
  const superAdmin = await prisma.users.create({
    data: {
      role: UserRole.SUPER_ADMIN,
      phone: '+8801712345101',
      email: 'admin@carenet.com',
      password_hash: await hashPassword('admin123'),
      name: 'Super Admin',
      language: 'en',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  // Create Moderator
  const moderator = await prisma.users.create({
    data: {
      role: UserRole.MODERATOR,
      phone: '+8801712345201',
      email: 'moderator@carenet.com',
      password_hash: await hashPassword('moderator123'),
      name: 'Platform Moderator',
      language: 'en',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  // Demo Super Admins
  const demoSuperAdmins = await Promise.all([
    {
      email: 'demosuperadmin1@carenet.com',
      phone: '+8801712345102',
      name: 'Demo Super Admin 1',
    },
    {
      email: 'demosuperadmin2@carenet.com',
      phone: '+8801712345103',
      name: 'Demo Super Admin 2',
    },
  ].map((u) =>
    prisma.users.create({
      data: {
        role: UserRole.SUPER_ADMIN,
        phone: u.phone,
        email: u.email,
        password_hash: demoPasswordHash,
        name: u.name,
        language: 'en',
        kyc_status: KyCStatus.VERIFIED,
        is_active: true,
      },
    })
  ));

  // Demo Moderators
  const demoModerators = await Promise.all([
    {
      email: 'demomoderator1@carenet.com',
      phone: '+8801712345202',
      name: 'Demo Moderator 1',
    },
    {
      email: 'demomoderator2@carenet.com',
      phone: '+8801712345203',
      name: 'Demo Moderator 2',
    },
  ].map((u) =>
    prisma.users.create({
      data: {
        role: UserRole.MODERATOR,
        phone: u.phone,
        email: u.email,
        password_hash: demoPasswordHash,
        name: u.name,
        language: 'en',
        kyc_status: KyCStatus.VERIFIED,
        is_active: true,
      },
    })
  ));

  // Create Company
  const companyUser = await prisma.users.create({
    data: {
      role: UserRole.COMPANY,
      phone: '+8801712345301',
      email: 'company@carenet.com',
      password_hash: await hashPassword('company123'),
      name: 'Care Services Ltd',
      language: 'en',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  const company = await prisma.companies.create({
    data: {
      userId: companyUser.id,
      company_name: 'Care Services Ltd',
      trade_license: 'TRD-2023-12345',
      trade_license_url: 'https://example.com/trade-license.pdf',
      tin: '123456789012',
      contact_person: 'John Doe',
      contact_phone: '+8801712345304',
      contact_email: 'contact@careservices.com',
      address: '123 Gulshan Avenue, Dhaka 1212, Bangladesh',
      description: 'Professional caregiver services for elderly and patients',
      payout_method: 'BANK_TRANSFER',
      payout_account: '1234567890',
      commission_rate: 12.00,
      subscription_tier: SubscriptionTier.GROWTH,
      rating_avg: 4.5,
      rating_count: 25,
      is_verified: true,
    },
  });

  // Demo Companies (Agencies)
  const demoCompanies = [] as { userId: string; companyId: string }[];
  for (let i = 1; i <= 2; i++) {
    const companyPhones = ['+8801712345302', '+8801712345303'];
    const user = await prisma.users.create({
      data: {
        role: UserRole.COMPANY,
        phone: companyPhones[i - 1],
        email: `democompany${i}@carenet.com`,
        password_hash: demoPasswordHash,
        name: `Demo Company ${i}`,
        language: 'en',
        kyc_status: KyCStatus.VERIFIED,
        is_active: true,
      },
    });

    const companyRow = await prisma.companies.create({
      data: {
        userId: user.id,
        company_name: `Demo Agency ${i}`,
        trade_license: `TRD-DEMO-${i}`,
        contact_person: `Demo Contact ${i}`,
        contact_phone: `+880171234530${i + 3}`,
        address: `Demo Agency Address ${i}, Dhaka`,
        payout_method: 'BANK_TRANSFER',
        payout_account: `0000${i}123456`,
        subscription_tier: SubscriptionTier.STARTER,
        rating_avg: 4.0,
        rating_count: 0,
        is_verified: false,
      },
    });

    demoCompanies.push({ userId: user.id, companyId: companyRow.id });
  }

  // Create Caregivers
  const caregiver1User = await prisma.users.create({
    data: {
      role: UserRole.CAREGIVER,
      phone: '+8801712345401',
      email: 'caregiver1@carenet.com',
      password_hash: await hashPassword('caregiver123'),
      name: 'Fatima Akter',
      language: 'bn',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  // Reverted mobility_level to mobilityLevel
  const caregiver1 = await prisma.caregivers.create({
    data: {
      userId: caregiver1User.id,
      nid: '1234567890123',
      nid_url: 'https://example.com/nid1.pdf',
      photo_url: 'https://example.com/photo1.jpg',
      date_of_birth: new Date('1990-05-15'),
      gender: Gender.FEMALE,
      address: '45 Dhanmondi, Dhaka 1209, Bangladesh',
      skills: ['elderly_care', 'medication_management', 'companionship'],
      certifications: ['nursing_certification', 'first_aid'],
      experience_years: 5,
      languages: ['bn', 'en'],
      hourly_rate: 500.0,
      background_check_status: BackgroundCheckStatus.CLEARED,
      background_check_date: new Date('2023-01-15'),
      rating_avg: 4.8,
      rating_count: 10,
      is_verified: true,
    },
  });

  const caregiver2User = await prisma.users.create({
    data: {
      role: UserRole.CAREGIVER,
      phone: '+8801712345402',
      email: 'caregiver2@carenet.com',
      password_hash: await hashPassword('caregiver123'),
      name: 'Rahman Khan',
      language: 'bn',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  const caregiver2 = await prisma.caregivers.create({
    data: {
      userId: caregiver2User.id,
      company_id: company.id,
      nid: '9876543210987',
      nid_url: 'https://example.com/nid2.pdf',
      photo_url: 'https://example.com/photo2.jpg',
      date_of_birth: new Date('1985-08-22'),
      gender: Gender.MALE,
      address: '78 Mirpur, Dhaka 1216, Bangladesh',
      location_lat: 23.8223,
      location_lng: 90.3654,
      skills: ['patient_care', 'mobility_assistance', 'companionship', 'meal_preparation'],
      certifications: ['nursing_assistant', 'cpr_certified'],
      experience_years: 8,
      languages: ['bn', 'en'],
      hourly_rate: 350.00,
      background_check_status: BackgroundCheckStatus.CLEARED,
      background_check_date: new Date('2023-02-20'),
      rating_avg: 4.6,
      rating_count: 12,
      total_jobs_completed: 18,
      is_available: true,
      is_verified: true,
    },
  });

  // Demo Caregivers
  for (let i = 1; i <= 2; i++) {
    const caregiverPhones = ['+8801712345403', '+8801712345404'];
    const user = await prisma.users.create({
      data: {
        role: UserRole.CAREGIVER,
        phone: caregiverPhones[i - 1],
        email: `democaregiver${i}@carenet.com`,
        password_hash: demoPasswordHash,
        name: `Demo Caregiver ${i}`,
        language: 'en',
        kyc_status: KyCStatus.VERIFIED,
        is_active: true,
      },
    });

    await prisma.caregivers.create({
      data: {
        userId: user.id,
        company_id: demoCompanies[i - 1]?.companyId,
        nid: `55667788990${i}`,
        nid_url: `https://example.com/demo-nid-${i}.pdf`,
        photo_url: `https://example.com/demo-photo-${i}.jpg`,
        date_of_birth: new Date('1992-01-0' + i),
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        address: `Demo Caregiver Address ${i}, Dhaka`,
        skills: ['basic_care', 'companionship'],
        certifications: ['basic_first_aid'],
        experience_years: 2 + i,
        languages: ['bn', 'en'],
        hourly_rate: 300 + i * 20,
        background_check_status: BackgroundCheckStatus.CLEARED,
        background_check_date: new Date('2024-01-0' + i),
        rating_avg: 0,
        rating_count: 0,
        total_jobs_completed: 0,
        is_available: true,
        is_verified: false,
      },
    });
  }

  // Create Guardian
  const guardianUser = await prisma.users.create({
    data: {
      role: UserRole.GUARDIAN,
      phone: '+8801712345501',
      email: 'guardian@carenet.com',
      password_hash: await hashPassword('guardian123'),
      name: 'Ahmed Hassan',
      language: 'en',
      kyc_status: KyCStatus.VERIFIED,
      is_active: true,
    },
  });

  // Demo Guardians (and patients for them)
  for (let i = 1; i <= 2; i++) {
    const guardianPhones = ['+8801712345502', '+8801712345503'];
    const guardian = await prisma.users.create({
      data: {
        role: UserRole.GUARDIAN,
        phone: guardianPhones[i - 1],
        email: `demoguardian${i}@carenet.com`,
        password_hash: demoPasswordHash,
        name: `Demo Guardian ${i}`,
        language: 'en',
        kyc_status: KyCStatus.VERIFIED,
        is_active: true,
      },
    });

    await prisma.patients.create({
      data: {
        guardian_id: guardian.id,
        name: `Demo Patient ${i}`,
        date_of_birth: new Date('1950-06-0' + i),
        gender: Gender.FEMALE,
        blood_group: 'A+',
        address: `Demo Patient Address ${i}, Dhaka`,
        emergency_contact_name: `Demo Guardian ${i}`,
        emergency_contact_phone: guardian.phone,
        primaryConditions: ['hypertension'],
        allergies: 'None',
        mobility_level: MobilityLevel.ASSISTED,
        cognitive_status: CognitiveStatus.NORMAL,
        photoUrl: `https://example.com/demo-patient-${i}.jpg`,
        consent_data_sharing: true,
        consent_marketing: false,
      },
    });
  }

  // Demo Patients as user accounts (optional)
  await Promise.all([
    {
      email: 'demopatient1@carenet.com',
      phone: '+8801712345601',
      name: 'Demo Patient User 1',
    },
    {
      email: 'demopatient2@carenet.com',
      phone: '+8801712345602',
      name: 'Demo Patient User 2',
    },
  ].map((u) =>
    prisma.users.create({
      data: {
        role: UserRole.PATIENT,
        phone: u.phone,
        email: u.email,
        password_hash: demoPasswordHash,
        name: u.name,
        language: 'en',
        kyc_status: KyCStatus.PENDING,
        is_active: true,
      },
    })
  ));

  // Create Patient
  const patient = await prisma.patients.create({
    data: {
      guardian_id: guardianUser.id,
      name: 'Mariam Hassan',
      date_of_birth: new Date('1945-03-10'),
      gender: Gender.FEMALE,
      blood_group: 'O+',
      address: '123 Gulshan Avenue, Dhaka 1212, Bangladesh',
      emergency_contact_name: 'Ahmed Hassan',
      emergency_contact_phone: guardianUser.phone,
      primaryConditions: ['diabetes', 'hypertension', 'arthritis'],
      allergies: 'Penicillin, Peanuts',
      mobility_level: MobilityLevel.ASSISTED,
      cognitive_status: CognitiveStatus.MILD_IMPAIRMENT,
      photoUrl: 'https://example.com/patient1.jpg',
      consent_data_sharing: true,
      consent_marketing: false,
    },
  });

  // Create Package
  const pkg = await prisma.packages.create({
    data: {
      company_id: company.id,
      name: 'Basic Elderly Care Package',
      description: 'Daily care and companionship for elderly patients',
      category: 'ELDERLY_CARE',
      price: 8000.00,
      duration_days: 30,
      hours_per_day: 8,
      inclusions: ['daily_care', 'medication_reminder', 'meal_assistance', 'companionship'],
      exclusions: ['medical_treatment', 'specialized_therapy'],
      caregiver_count: 1,
      is_active: true,
      min_advance_days: 2,
    },
  });

  // Create Job
  const job = await prisma.jobs.create({
    data: {
      package_id: pkg.id,
      patient_id: patient.id,
      company_id: company.id,
      guardian_id: guardianUser.id,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: JobStatus.ACTIVE,
      total_price: 8000.00,
      commission_amount: 960.00, // 12% of 8000
      payout_amount: 7040.00, // 8000 - 960
      special_instructions: 'Patient prefers Bengali language, needs assistance with walking',
    },
  });

  // Create Assignment
  const assignment = await prisma.assignments.create({
    data: {
      job_id: job.id,
      caregiver_id: caregiver1.id,
      role: AssignmentRole.PRIMARY,
      shift_start_time: '09:00',
      shift_end_time: '17:00',
      days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      status: AssignmentStatus.ACTIVE,
    },
  });

  // Create Payment
  await prisma.payments.create({
    data: {
      job_id: job.id,
      payer_id: guardianUser.id,
      amount: 8000.00,
      method: PaymentMethod.BKASH,
      transaction_id: 'TXN' + Date.now(),
      status: PaymentStatus.COMPLETED,
      invoice_number: 'INV' + Date.now(),
      invoice_url: 'https://example.com/invoice1.pdf',
      receipt_url: 'https://example.com/receipt1.pdf',
      paid_at: new Date(),
    },
  });

  // Create Sample Care Logs
  await prisma.care_logs.createMany({
    data: [
      {
        job_id: job.id,
        assignment_id: assignment.id,
        caregiver_id: caregiver1.id,
        patient_id: patient.id,
        log_type: LogType.CHECK_IN,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        location_lat: 23.7465,
        location_lng: 90.3760,
        data: { note: 'Checked in on time' },
        notes: 'Patient seems well today',
        guardian_notified: true,
      },
      {
        job_id: job.id,
        assignment_id: assignment.id,
        caregiver_id: caregiver1.id,
        patient_id: patient.id,
        log_type: LogType.MEDICATION,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        data: { 
          medication: 'Metformin',
          dosage: '500mg',
          time: 'after_lunch',
          given: true
        },
        notes: 'Medication given as prescribed',
        guardian_notified: false,
      },
      {
        job_id: job.id,
        assignment_id: assignment.id,
        caregiver_id: caregiver1.id,
        patient_id: patient.id,
        log_type: LogType.MEAL,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        data: { 
          meal: 'lunch',
          food: 'rice, dal, vegetables, fish',
          eaten: 'full',
          appetite: 'good'
        },
        notes: 'Patient ate well, good appetite',
        guardian_notified: false,
      },
    ],
  });

  // Create Sample Feedback
  await prisma.feedbacks.create({
    data: {
      job_id: job.id,
      from_user_id: guardianUser.id,
      to_user_id: caregiver1User.id,
      reviewee_type: 'CAREGIVER',
      rating: 5,
      comments: 'Excellent care, very professional and caring',
    },
  });

  // Create Sample Notifications
  await prisma.notifications.createMany({
    data: [
      {
        userId: guardianUser.id,
        type: 'IN_APP',
        channel: 'in_app',
        data: {
          message: 'New care log added for Mariam Hassan',
          patientName: 'Mariam Hassan',
          caregiverName: 'Fatima Akter'
        },
        body: 'New care log added for Mariam Hassan',
        status: 'PENDING',
      },
      {
        userId: caregiver1User.id,
        type: 'IN_APP',
        channel: 'in_app',
        data: {
          message: 'New job assigned',
          patientName: 'Mariam Hassan',
          startDate: new Date()
        },
        body: 'New job assigned for Mariam Hassan',
        status: 'SENT',
      },
    ],
  });

  // Create Audit Logs
  await prisma.audit_logs.createMany({
    data: [
      {
        actor_id: superAdmin.id,
        actor_role: 'SUPER_ADMIN',
        action_type: 'user_created',
        entity_type: 'User',
        entity_id: moderator.id,
        changes: {
          targetUserId: moderator.id,
          targetRole: 'MODERATOR'
        },
      },
      {
        actor_id: moderator.id,
        actor_role: 'MODERATOR',
        action_type: 'company_verified',
        entity_type: 'Company',
        entity_id: company.id,
        changes: {
          companyId: company.id,
          companyName: 'Care Services Ltd'
        },
      },
    ],
  });

  // Create Escrow Records
  const escrowRecord = await prisma.escrow_records.create({
    data: {
      user_id: companyUser.id,
      amount: 5000.0,
      currency: 'BDT',
      status: 'PENDING',
    },
  });

  await prisma.escrow_ledger.create({
    data: {
      escrow_record_id: escrowRecord.id,
      transaction_type: 'DEPOSIT',
      amount: 5000.0,
    },
  });

  // Create Provider Transactions
  await prisma.provider_transactions.create({
    data: {
      provider: 'BKASH',
      transaction_id: 'TX123456789',
      amount: 5000.0,
      currency: 'BDT',
      status: PaymentStatus.PENDING,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log(`   - 1 Super Admin: ${superAdmin.name}`);
  console.log('   - 2 Demo Super Admins');
  console.log(`   - 1 Moderator: ${moderator.name}`);
  console.log('   - 2 Demo Moderators');
  console.log(`   - 1 Company: ${company.company_name}`);
  console.log('   - 2 Demo Companies (agencies)');
  console.log(`   - 2 Caregivers: User IDs ${caregiver1.userId}, ${caregiver2.userId}`);
  console.log('   - 2 Demo Caregivers');
  console.log(`   - 1 Guardian: ${guardianUser.name}`);
  console.log('   - 2 Demo Guardians');
  console.log('   - 2 Demo Patients for guardians');
  console.log('   - 2 Demo Patient user accounts');
  console.log(`   - 1 Patient: ${patient.name}`);
  console.log(`   - 1 Package: ${pkg.name}`);
  console.log(`   - 1 Job: Active`);
  console.log(`   - 1 Assignment: Active`);
  console.log(`   - 1 Payment: Completed`);
  console.log(`   - 3 Care Logs`);
  console.log(`   - 1 Feedback`);
  console.log(`   - 2 Notifications`);
  console.log(`   - 2 Audit Logs`);
  console.log(`   - 1 Escrow Record`);
  console.log(`   - 1 Escrow Ledger`);
  console.log(`   - 1 Provider Transaction`);
  
  console.log('\n📝 Additional Comprehensive Seed Data Examples:');
  console.log('The seed script includes realistic test data for all user roles and entities.');
  console.log('You can extend this script to add more test data by:');
  console.log('  1. Adding more caregivers with different specializations');
  console.log('  2. Creating multiple companies with various service zones');
  console.log('  3. Adding more patients with diverse medical conditions');
  console.log('  4. Creating sample marketplace jobs and applications');
  console.log('  5. Adding more care log entries with different log types');
  console.log('  6. Creating feedback entries between different user types');
  console.log('  7. Adding disputes with different resolutions');
  console.log('  8. Creating notifications for various channels');
  console.log('  9. Adding audit logs for different actions');
  console.log('\n💡 Tip: Use this seed data as a reference for testing different scenarios.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
