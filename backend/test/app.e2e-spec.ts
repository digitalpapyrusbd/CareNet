import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';

describe('API Integration Tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors();
    await app.init();
  });

  describe('Authentication Flow', () => {
    const uniqueId = Date.now();
    const testPhone = `+88017${uniqueId.toString().slice(-8)}`;

    it('should register a new user', async () => {
      const userData = {
        phone: testPhone,
        password: 'password123',
        name: 'Test User',
        email: `test${uniqueId}@example.com`,
        role: 'GUARDIAN',
      };

      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      console.log('Registration Response:', JSON.stringify(response.body, null, 2));
      console.log('Status Code:', response.status);

      expect(response.status).toBe(201);
      expect(response.body.data.user.phone).toBe(userData.phone);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        phone: testPhone,
        password: 'password123',
      };

      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.phone).toBe(loginData.phone);
    });

    it('should access protected route with JWT token', async () => {
      // First login to get token
      const loginResponse = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send({
          phone: testPhone,
          password: 'password123',
        });

      const token = loginResponse.body.data.accessToken;

      // Access protected route
      const response = await supertest(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
    });
  });

  describe('Guardian Flow', () => {
    let guardianToken: string;
    let patientId: string;
    let packageId: string;
    const uniqueId = Date.now() + 1;
    const guardianPhone = `+88018${uniqueId.toString().slice(-8)}`;

    beforeAll(async () => {
      // Register and login as guardian
      const registerResponse = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: guardianPhone,
          password: 'password123',
          name: 'Test Guardian',
          email: `guardian${uniqueId}@example.com`,
          role: 'GUARDIAN',
        });

      guardianToken = registerResponse.body.data.accessToken;

      // Create a patient
      const patientResponse = await supertest(app.getHttpServer())
        .post('/patients')
        .set('Authorization', `Bearer ${guardianToken}`)
        .send({
          name: 'Test Patient',
          date_of_birth: '1950-01-01',
          gender: 'MALE',
          address: '123 Test Street, Dhaka, Bangladesh',
          blood_group: 'O+',
          primaryConditions: 'Hypertension, Diabetes',
          allergies: 'None',
          mobility_level: 'ASSISTED',
          cognitive_status: 'MILD_IMPAIRMENT',
          emergency_contact_name: 'Emergency Contact',
          emergency_contact_phone: '+8801234567890',
        })
        .expect(201);

      patientId = patientResponse.body.data.id;

      // Create a package for the job
      const pkgResponse = await supertest(app.getHttpServer())
        .post('/packages')
        .set('Authorization', `Bearer ${guardianToken}`)
        .send({
          name: 'Weekly Home Care',
          description: '7 days of home care services',
          category: 'ELDERLY_CARE',
          price: 10500,
          duration_days: 7,
          hours_per_day: 8,
          inclusions: ['daily_care', 'medication_reminder', 'meal_assistance'],
          exclusions: ['medical_treatment'],
          caregiver_count: 1,
          is_active: true,
          min_advance_days: 2,
        });

      packageId = pkgResponse.body.data?.id;
      console.log('Package created:', pkgResponse.body);
    });

    it('should create a patient successfully', async () => {
      expect(patientId).toBeDefined();
    });

    it('should create a job for the patient', async () => {
      const jobData = {
        patient_id: patientId,
        package_id: packageId,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        special_instructions: 'Daily care and assistance for elderly patient',
        total_price: 10500,
      };

      const response = await supertest(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${guardianToken}`)
        .send(jobData);

      console.log('Job Creation Response:', JSON.stringify(response.body, null, 2));
      console.log('Package ID:', packageId);
      console.log('Patient ID:', patientId);

      expect(response.status).toBe(201);
      if (response.body.data) {
        expect(response.body.data.patient_id).toBe(patientId);
        expect(response.body.data.status).toBe('PENDING_ASSIGNMENT');
      }
    });

    it('should process payment for the job', async () => {
      // First create a package
      const packageResponse = await supertest(app.getHttpServer())
        .post('/packages')
        .set('Authorization', `Bearer ${guardianToken}`)
        .send({
          name: 'Weekly Home Care',
          description: '7 days of home care services',
          price: 10500, // 1500 * 7 days
          duration_days: 7,
          hours_per_day: 8,
          caregiver_count: 1,
          inclusions: ['Daily care', 'Medication management', 'Emergency support'],
          category: 'ELDERLY_CARE',
        })
        .expect(201);

      const packageId = packageResponse.body.data.id;

      // Create payment
      const paymentData = {
        job_id: 'test-job-id', // Would use actual job ID in real test
        package_id: packageId,
        payment_method: 'BKASH',
        amount: 10500,
      };

      const response = await supertest(app.getHttpServer())
        .post('/payments/create')
        .set('Authorization', `Bearer ${guardianToken}`)
        .send(paymentData);

      console.log('Payment Response:', response.status, response.body);
      expect(response.status).toBe(201);

      expect(response.body.data.payment_url).toBeDefined();
      expect(response.body.data.amount).toBe(10500);
    });
  });

  describe('Caregiver Flow', () => {
    let caregiverToken: string;
    let caregiverId: string;
    let patientId: string;
    let jobId: string;
    const uniqueId = Date.now() + 2;
    const caregiverPhone = `+88019${uniqueId.toString().slice(-8)}`;

    beforeAll(async () => {
      // Register and login as caregiver
      const registerResponse = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: caregiverPhone,
          password: 'password123',
          name: 'Test Caregiver',
          email: `caregiver${uniqueId}@example.com`,
          role: 'CAREGIVER',
        });

      caregiverToken = registerResponse.body.data.accessToken;

      // Create caregiver profile
      const caregiverResponse = await supertest(app.getHttpServer())
        .post('/caregivers')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({
          bio: 'Experienced caregiver with 5+ years of service',
          experience_years: 5,
          qualifications: ['First Aid Certificate', 'Nursing Assistant'],
          preferred_service_areas: ['Dhanmondi', 'Gulshan', 'Banani'],
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
          hourly_rate: 200,
        })
        .expect(201);

      caregiverId = caregiverResponse.body.data.id;

      // Create a patient for testing care logs
      const patientResponse = await supertest(app.getHttpServer())
        .post('/patients')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({
          name: 'Test Patient for Care Logs',
          date_of_birth: '1945-06-15',
          gender: 'FEMALE',
          address: '456 Care Street, Dhaka',
          blood_group: 'A+',
          primaryConditions: 'Arthritis',
          allergies: 'Penicillin',
          mobility_level: 'WHEELCHAIR',
          cognitive_status: 'NORMAL',
          emergency_contact_name: 'Emergency Contact',
          emergency_contact_phone: '+8801987654321',
        })
        .expect(201);

      patientId = patientResponse.body.data.id;

      // Create a package first (need to register as company temporarily)
      const companyRegResponse = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: `+88016${Date.now().toString().slice(-8)}`,
          password: 'password123',
          name: 'Temp Company for Caregiver Test',
          email: `tempcompany${Date.now()}@example.com`,
          role: 'COMPANY',
        });

      const tempCompanyToken = companyRegResponse.body.data.accessToken;

      await supertest(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${tempCompanyToken}`)
        .send({
          name: 'Temp Care Services',
          description: 'Temporary company for testing',
          license_number: `LC-${Date.now()}`,
          address: 'Test Address',
          service_areas: ['Dhaka'],
          contact_phone: '+8801234567890',
          contact_email: 'temp@test.com',
        })
        .expect(201);

      const pkgResponse = await supertest(app.getHttpServer())
        .post('/packages')
        .set('Authorization', `Bearer ${tempCompanyToken}`)
        .send({
          name: 'Caregiver Test Package',
          description: 'Package for testing care logs',
          category: 'ELDERLY_CARE',
          price: 7000,
          duration_days: 7,
          hours_per_day: 8,
          caregiver_count: 1,
          inclusions: ['daily_care'],
          is_active: true,
        })
        .expect(201);

      const packageId = pkgResponse.body.data.id;

      // Now create job as caregiver (acting as guardian)
      const jobResponse = await supertest(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send({
          patient_id: patientId,
          package_id: packageId,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          special_instructions: 'Daily care for elderly patient',
          total_price: 7000,
        })
        .expect(201);

      jobId = jobResponse.body.data.id;
    });

    it('should check in for a job', async () => {
      const checkInData = {
        job_id: jobId,
        patient_id: patientId,
        location: {
          latitude: 23.8103,
          longitude: 90.4125,
        },
      };

      const response = await supertest(app.getHttpServer())
        .post('/care-logs/check-in')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send(checkInData)
        .expect(201);

      expect(response.body.data.log_type).toBe('CHECK_IN');
      expect(Number(response.body.data.location_lat)).toBe(23.8103);
      expect(Number(response.body.data.location_lng)).toBe(90.4125);
    });

    it('should log vitals', async () => {
      const vitalsData = {
        job_id: jobId,
        patient_id: patientId,
        log_type: 'VITALS',
        data: {
          vitals: {
            blood_pressure: '120/80',
            heart_rate: 72,
            temperature: 36.5,
            oxygen_saturation: 98,
          },
        },
      };

      const response = await supertest(app.getHttpServer())
        .post('/care-logs')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send(vitalsData)
        .expect(201);

      expect(response.body.data.log_type).toBe('VITALS');
      expect(response.body.data.data.vitals).toBeDefined();
    });

    it('should check out from a job', async () => {
      const checkOutData = {
        job_id: jobId,
        patient_id: patientId,
        location: {
          latitude: 23.8103,
          longitude: 90.4125,
        },
        final_notes: 'Patient stable, all medications administered',
      };

      const response = await supertest(app.getHttpServer())
        .post('/care-logs/check-out')
        .set('Authorization', `Bearer ${caregiverToken}`)
        .send(checkOutData)
        .expect(201);

      expect(response.body.data.log_type).toBe('CHECK_OUT');
      expect(response.body.data.notes).toBe('Patient stable, all medications administered');
    });
  });

  describe('Company Flow', () => {
    let companyToken: string;
    let caregiverId: string;
    let patientId: string;
    let packageId: string;
    let jobId: string;
    const uniqueId = Date.now() + 3;
    const companyPhone = `+88015${uniqueId.toString().slice(-8)}`;

    beforeAll(async () => {
      // Register and login as company
      const registerResponse = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: companyPhone,
          password: 'password123',
          name: 'Test Company',
          email: `company${uniqueId}@example.com`,
          role: 'COMPANY',
        });

      companyToken = registerResponse.body.data.accessToken;

      // Create company profile
      await supertest(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          name: 'Test Care Services Ltd',
          description: 'Professional caregiver services in Dhaka',
          license_number: 'LC-2025-1234',
          address: '456 Business Ave, Dhaka, Bangladesh',
          service_areas: ['Dhanmondi', 'Gulshan', 'Uttara'],
          contact_phone: '+8801555667788',
          contact_email: 'info@testcompany.com',
        })
        .expect(201);

      // Create a caregiver for testing
      const caregiverResponse = await supertest(app.getHttpServer())
        .post('/caregivers')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          bio: 'Test caregiver for company',
          experience_years: 3,
          qualifications: ['Care Certificate'],
          preferred_service_areas: ['Dhaka'],
          hourly_rate: 180,
        })
        .expect(201);

      caregiverId = caregiverResponse.body.data.id;

      // Create a patient for job assignment
      const patientResponse = await supertest(app.getHttpServer())
        .post('/patients')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          name: 'Test Patient for Assignment',
          date_of_birth: '1950-03-20',
          gender: 'MALE',
          address: '789 Test Road, Dhaka',
          blood_group: 'B+',
          primaryConditions: 'Diabetes',
          mobility_level: 'INDEPENDENT',
          cognitive_status: 'NORMAL',
          emergency_contact_name: 'Contact Person',
          emergency_contact_phone: '+8801122334455',
        })
        .expect(201);

      patientId = patientResponse.body.data.id;

      // Create a package
      const pkgResponse = await supertest(app.getHttpServer())
        .post('/packages')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          name: 'Company Test Package',
          description: 'Package for assignment testing',
          category: 'ELDERLY_CARE',
          price: 8400,
          duration_days: 7,
          hours_per_day: 8,
          caregiver_count: 1,
          inclusions: ['personal_care', 'companionship'],
          is_active: true,
        })
        .expect(201);

      packageId = pkgResponse.body.data.id;

      // Create a job
      const jobResponse = await supertest(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          patient_id: patientId,
          package_id: packageId,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          special_instructions: 'Test job for caregiver assignment',
          total_price: 8400,
        })
        .expect(201);

      jobId = jobResponse.body.data.id;
    });

    it('should verify a caregiver', async () => {
      const response = await supertest(app.getHttpServer())
        .patch(`/caregivers/${caregiverId}/verify`)
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          verification_status: 'VERIFIED',
          verification_notes: 'Documents verified and background check passed',
        })
        .expect(200);

      expect(response.body.data.verification_status).toBe('VERIFIED');
    });

    it('should assign caregiver to job', async () => {
      const assignmentData = {
        job_id: jobId,
        caregiver_id: caregiverId,
        role: 'PRIMARY',
        shift_start_time: '09:00',
        shift_end_time: '17:00',
        days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      };

      const response = await supertest(app.getHttpServer())
        .post('/jobs/assign')
        .set('Authorization', `Bearer ${companyToken}`)
        .send(assignmentData)
        .expect(201);

      expect(response.body.data.caregiver_id).toBe(caregiverId);
      expect(response.body.data.role).toBe('PRIMARY');
    });
  });

  describe('Moderator Flow', () => {
    let moderatorToken: string;
    let companyId: string;
    const uniqueId = Date.now() + 4;
    const moderatorPhone = `+88013${uniqueId.toString().slice(-8)}`;

    beforeAll(async () => {
      // Register and login as moderator
      const registerResponse = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send({
          phone: moderatorPhone,
          password: 'password123',
          name: 'Test Moderator',
          email: `moderator${uniqueId}@example.com`,
          role: 'MODERATOR',
        });

      moderatorToken = registerResponse.body.data.accessToken;

      // Get a company to approve
      const companiesResponse = await supertest(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(200);

      companyId = companiesResponse.body.data[0]?.id || 'test-company-id';
    });

    it('should approve a company', async () => {
      const response = await supertest(app.getHttpServer())
        .patch(`/companies/${companyId}/verify`)
        .set('Authorization', `Bearer ${moderatorToken}`)
        .send({
          verification_status: 'VERIFIED',
          verification_notes: 'License and documents verified',
        })
        .expect(200);

      expect(response.body.data.verification_status).toBe('VERIFIED');
    });

    it('should view platform analytics', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${moderatorToken}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalUsers).toBeDefined();
      expect(response.body.data.totalJobs).toBeDefined();
      expect(response.body.data.totalRevenue).toBeDefined();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});