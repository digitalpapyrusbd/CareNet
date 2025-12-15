import { rest } from 'msw';

const DEFAULT_BASES = ['http://localhost:4000', 'http://localhost:3000/api', 'http://localhost/api'];
const apiBases = Array.from(new Set([process.env.NEXT_PUBLIC_API_URL, ...DEFAULT_BASES])).filter(Boolean) as string[];

const createPostHandlers = (path: string, resolver: Parameters<typeof rest.post>[1]) =>
  apiBases.map((base) => rest.post(`${base}${path}`, resolver));

const createGetHandlers = (path: string, resolver: Parameters<typeof rest.get>[1]) =>
  apiBases.map((base) => rest.get(`${base}${path}`, resolver));

const createPutHandlers = (path: string, resolver: Parameters<typeof rest.put>[1]) =>
  apiBases.map((base) => rest.put(`${base}${path}`, resolver));

const createDeleteHandlers = (path: string, resolver: Parameters<typeof rest.delete>[1]) =>
  apiBases.map((base) => rest.delete(`${base}${path}`, resolver));

const createHandlers = (method: 'get' | 'post' | 'put' | 'delete', path: string, resolver: any) => {
  switch (method) {
    case 'post': return createPostHandlers(path, resolver);
    case 'get': return createGetHandlers(path, resolver);
    case 'put': return createPutHandlers(path, resolver);
    case 'delete': return createDeleteHandlers(path, resolver);
  }
};

export const handlers = [
  // Auth - Login
  ...createPostHandlers('/auth/login', async (req, res, ctx) => {
    const body = await req.json() as { phone: string; password: string };
    
    if (body.phone === '+8801700000000' && body.password === 'password123') {
      return res(
        ctx.json({
          success: true,
          user: {
            id: 'user-123',
            phone: '+8801700000000',
            role: 'GUARDIAN',
            name: 'Test Guardian',
            email: 'test@example.com',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Invalid credentials',
      })
    );
  }),

  // Auth - Logout (DELETE /auth/login)
  ...createDeleteHandlers('/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: 'Logged out successfully',
      })
    );
  }),

  // Auth - Get Current User
  ...createGetHandlers('/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return res(
        ctx.json({
          success: true,
          user: {
            id: 'user-123',
            phone: '+8801700000000',
            role: 'GUARDIAN',
            name: 'Test Guardian',
            email: 'test@example.com',
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Unauthorized',
      })
    );
  }),

  // Auth - Update Profile (PUT /auth/me)
  ...createHandlers('put', '/auth/me', async (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    const body = await req.json() as Partial<{ name: string; email: string }>;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return res(
        ctx.json({
          success: true,
          user: {
            id: 'user-123',
            phone: '+8801700000000',
            role: 'GUARDIAN',
            name: body.name || 'Test Guardian',
            email: body.email || 'test@example.com',
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Unauthorized',
      })
    );
  }),

  // Auth - Refresh Token (PUT /auth/login)
  ...createHandlers('put', '/auth/login', async (req, res, ctx) => {
    const body = await req.json() as { refreshToken: string };
    
    if (body.refreshToken) {
      return res(
        ctx.json({
          success: true,
          tokens: {
            accessToken: 'new-access-token',
            refreshToken: body.refreshToken,
          },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        error: 'Invalid refresh token',
      })
    );
  }),

  // Patients - Create
  ...createPostHandlers('/patients', async (req, res, ctx) => {
    const body = await req.json() as { name: string; phone: string; email?: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'patient-' + Date.now(),
          ...body,
          guardianId: 'user-123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Patients - List
  ...createGetHandlers('/patients', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'patient-1',
            name: 'John Doe',
            phone: '+8801712345678',
            email: 'john@example.com',
            guardianId: 'user-123',
            createdAt: '2025-11-20T10:00:00Z',
            updatedAt: '2025-11-20T10:00:00Z',
          },
        ],
      })
    );
  }),

  // Packages - List
  ...createGetHandlers('/packages', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'package-1',
            name: 'Basic Care Package',
            description: '24/7 basic care and monitoring',
            price: 5000,
            duration: 30,
            services: ['Daily check-ins', 'Medication reminders', 'Emergency support'],
            companyId: 'company-1',
            company: {
              companyName: 'CareGiver Solutions',
            },
            isActive: true,
            createdAt: '2025-11-01T00:00:00Z',
          },
          {
            id: 'package-2',
            name: 'Premium Care Package',
            description: 'Comprehensive care with dedicated caregiver',
            price: 15000,
            duration: 30,
            services: ['24/7 dedicated caregiver', 'Medical monitoring', 'Physical therapy', 'Emergency support'],
            companyId: 'company-1',
            company: {
              companyName: 'CareGiver Solutions',
            },
            isActive: true,
            createdAt: '2025-11-01T00:00:00Z',
          },
        ],
      })
    );
  }),

  // Packages - Get Single
  ...createGetHandlers('/packages/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        success: true,
        data: {
          id,
          name: 'Basic Care Package',
          description: '24/7 basic care and monitoring',
          price: 5000,
          duration: 30,
          services: ['Daily check-ins', 'Medication reminders', 'Emergency support'],
          companyId: 'company-1',
          company: {
            companyName: 'CareGiver Solutions',
          },
          isActive: true,
          createdAt: '2025-11-01T00:00:00Z',
        },
      })
    );
  }),

  // Jobs - Create (Package Purchase)
  ...createPostHandlers('/jobs', async (req, res, ctx) => {
    const body = await req.json() as { packageId: string; patientId: string; startDate: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'job-' + Date.now(),
          ...body,
          status: 'PENDING',
          totalPrice: 5000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Payments - Create Payment Intent
  ...createPostHandlers('/payments/create-intent', async (req, res, ctx) => {
    const body = await req.json() as { amount: number; jobId: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          clientSecret: 'mock-payment-intent-secret',
          paymentIntentId: 'pi-mock-' + Date.now(),
          amount: body.amount,
        },
      })
    );
  }),

  // Payments - Confirm Payment
  ...createPostHandlers('/payments/confirm', async (req, res, ctx) => {
    const body = await req.json() as { paymentIntentId: string; jobId: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'payment-' + Date.now(),
          jobId: body.jobId,
          amount: 5000,
          status: 'COMPLETED',
          method: 'CARD',
          transactionId: 'txn-mock-' + Date.now(),
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Auth - Register
  ...createPostHandlers('/auth/register', async (req, res, ctx) => {
    const body = await req.json() as { phone: string; password: string; name: string; role?: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'user-' + Date.now(),
          phone: body.phone,
          name: body.name,
          role: body.role || 'GUARDIAN',
          email: null,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Dashboard Stats
  ...createGetHandlers('/dashboard/stats', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          totalPatients: 3,
          activeJobs: 2,
          completedJobs: 5,
          pendingPayments: 1,
          totalSpent: 15000,
          upcomingAppointments: 2,
        },
      })
    );
  }),

  // Users - List (for admin/testing)
  ...createGetHandlers('/users', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'user-1',
            phone: '+8801712345678',
            name: 'Test User 1',
            role: 'GUARDIAN',
            email: 'user1@test.com',
          },
          {
            id: 'user-2',
            phone: '+8801812345678',
            name: 'Test User 2',
            role: 'CAREGIVER',
            email: 'user2@test.com',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      })
    );
  }),

  // Jobs - Get with details (for verification after purchase)
  ...createGetHandlers('/jobs/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        success: true,
        data: {
          id,
          packageId: 'package-1',
          patientId: 'patient-1',
          status: 'ACTIVE',
          totalPrice: 5000,
          startDate: new Date().toISOString(),
          package: {
            name: 'Basic Care Package',
            description: '24/7 basic care and monitoring',
          },
          patient: {
            name: 'John Doe',
          },
          payment: {
            status: 'COMPLETED',
            amount: 5000,
          },
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Notifications - List
  ...createGetHandlers('/notifications', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'notif-1',
            title: 'Payment Confirmed',
            message: 'Your payment of ৳5000 has been confirmed',
            type: 'PAYMENT',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif-2',
            title: 'Job Started',
            message: 'Your caregiver has started the job',
            type: 'JOB',
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        total: 2,
        unread: 1,
      })
    );
  }),

  // Notifications - Mark as Read
  ...createPostHandlers('/notifications/:id/read', async (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        success: true,
        data: {
          id,
          isRead: true,
        },
      })
    );
  }),

  // Escrow - Create Hold
  ...createPostHandlers('/escrow/hold', async (req, res, ctx) => {
    const body = await req.json() as { jobId: string; amount: number };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'escrow-' + Date.now(),
          jobId: body.jobId,
          amount: body.amount,
          status: 'HELD',
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Escrow - Release Payment
  ...createPostHandlers('/escrow/:id/release', async (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.json({
        success: true,
        data: {
          id,
          status: 'RELEASED',
          releasedAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Feedback - Submit
  ...createPostHandlers('/feedback', async (req, res, ctx) => {
    const body = await req.json() as { jobId: string; rating: number; comment: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'feedback-' + Date.now(),
          ...body,
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Care Logs - List
  ...createGetHandlers('/care-logs', (req, res, ctx) => {
    const jobId = req.url.searchParams.get('jobId');
    
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'log-1',
            jobId: jobId || 'job-1',
            type: 'MEDICATION',
            notes: 'Administered morning medication',
            timestamp: new Date().toISOString(),
            caregiverId: 'caregiver-1',
          },
          {
            id: 'log-2',
            jobId: jobId || 'job-1',
            type: 'VITALS',
            notes: 'Blood pressure: 120/80, Temperature: 98.6°F',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            caregiverId: 'caregiver-1',
          },
        ],
      })
    );
  }),

  // Care Logs - Create
  ...createPostHandlers('/care-logs', async (req, res, ctx) => {
    const body = await req.json() as { jobId: string; type: string; notes: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'log-' + Date.now(),
          ...body,
          timestamp: new Date().toISOString(),
          caregiverId: 'caregiver-1',
        },
      })
    );
  }),

  // Disputes - Create
  ...createPostHandlers('/disputes', async (req, res, ctx) => {
    const body = await req.json() as { jobId: string; reason: string; description: string };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'dispute-' + Date.now(),
          ...body,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Disputes - List
  ...createGetHandlers('/disputes', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'dispute-1',
            jobId: 'job-1',
            reason: 'SERVICE_QUALITY',
            description: 'Caregiver was late multiple times',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
        ],
      })
    );
  }),

  // Files - Upload
  ...createPostHandlers('/files/upload', async (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'file-' + Date.now(),
          filename: 'document.pdf',
          url: 'https://example.com/files/document.pdf',
          size: 1024000,
          mimeType: 'application/pdf',
          createdAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Verification - Submit Documents
  ...createPostHandlers('/verification/submit', async (req, res, ctx) => {
    const body = await req.json() as { type: string; documentUrls: string[] };
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'verification-' + Date.now(),
          type: body.type,
          status: 'PENDING',
          submittedAt: new Date().toISOString(),
        },
      })
    );
  }),

  // Profile - Get
  ...createGetHandlers('/profile', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'user-123',
          phone: '+8801700000000',
          name: 'Test Guardian',
          email: 'test@example.com',
          role: 'GUARDIAN',
          profilePicture: null,
          address: '123 Test Street, Dhaka',
          emergencyContact: '+8801800000000',
          createdAt: '2025-01-01T00:00:00Z',
        },
      })
    );
  }),

  // Profile - Update
  ...createPostHandlers('/profile', async (req, res, ctx) => {
    const body = await req.json();
    
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'user-123',
          ...body,
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }),
].flat();
