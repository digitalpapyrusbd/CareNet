// Minimal manual mock for @prisma/client used in Jest tests
// Expand these methods as tests require more realistic returns

const mockPrismaClient = {
  user: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data) => ({ id: 'mock-user', ...data }),
    createMany: async ({ data }) => ({ count: Array.isArray(data) ? data.length : 0 }),
    update: async (data) => ({ ...data }),
  },
  company: {
    findMany: async () => [],
    create: async (data) => ({ id: 'mock-company', ...data }),
  },
  caregiver: {
    findMany: async () => [],
    create: async (data) => ({ id: 'mock-caregiver', ...data }),
  },
  patient: {
    findMany: async () => [],
    create: async (data) => ({ id: 'mock-patient', ...data }),
  },
  package: {
    findMany: async () => [],
  },
  job: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data) => ({ id: 'mock-job', ...data }),
    update: async (data) => ({ ...data }),
  },
  payment: {
    create: async (data) => ({ id: 'mock-payment', ...data }),
    update: async (data) => ({ ...data }),
    findUnique: async () => null,
  },
  assignment: {
    create: async (data) => ({ id: 'mock-assignment', ...data }),
  },
  careLog: {
    createMany: async (data) => ({ count: Array.isArray(data?.data) ? data.data.length : 0 }),
  },
  feedback: {
    create: async () => ({}),
  },
  notification: {
    create: async () => ({}),
    createMany: async () => ({ count: 0 }),
  },
  auditLog: {
    createMany: async (data) => ({ count: Array.isArray(data?.data) ? data.data.length : 0 }),
  },
  userDevice: {
    findMany: async () => [],
    upsert: async () => ({}),
    updateMany: async () => ({}),
  },
  $connect: async () => {},
  $disconnect: async () => {},
};

// Export a minimal UserRole enum to satisfy imports from @prisma/client
const UserRole = {
  COMPANY: 'COMPANY',
  CAREGIVER: 'CAREGIVER',
  GUARDIAN: 'GUARDIAN',
  PATIENT: 'PATIENT',
  SUPER_ADMIN: 'SUPER_ADMIN',
  MODERATOR: 'MODERATOR',
};

module.exports = {
  PrismaClient: function () {
    return mockPrismaClient;
  },
  UserRole,
};
