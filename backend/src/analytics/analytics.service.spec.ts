import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prismaService: PrismaService;

  // Mock PrismaService
  const mockPrismaService = {
    users: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    companies: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    caregivers: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    patients: {
      count: jest.fn(),
    },
    jobs: {
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    payments: {
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOverview', () => {
    it('should return analytics overview with correct data', async () => {
      // Arrange
      mockPrismaService.users.count.mockResolvedValue(100);
      mockPrismaService.companies.count.mockResolvedValue(20);
      mockPrismaService.caregivers.count.mockResolvedValue(50);
      mockPrismaService.patients.count.mockResolvedValue(30);
      mockPrismaService.jobs.count
        .mockResolvedValueOnce(15) // activeJobs
        .mockResolvedValueOnce(85); // completedJobs
      mockPrismaService.payments.aggregate.mockResolvedValue({
        _sum: { amount: 50000 },
      });

      // Act
      const result = await service.getOverview();

      // Assert
      expect(result).toEqual({
        totalUsers: 100,
        totalCompanies: 20,
        totalCaregivers: 50,
        totalPatients: 30,
        activeJobs: 15,
        completedJobs: 85,
        totalRevenue: 50000,
        timestamp: expect.any(Date),
      });

      expect(mockPrismaService.users.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.companies.count).toHaveBeenCalledWith({
        where: { is_verified: true },
      });
      expect(mockPrismaService.jobs.count).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
      });
    });

    it('should handle null revenue sum', async () => {
      // Arrange
      mockPrismaService.users.count.mockResolvedValue(0);
      mockPrismaService.companies.count.mockResolvedValue(0);
      mockPrismaService.caregivers.count.mockResolvedValue(0);
      mockPrismaService.patients.count.mockResolvedValue(0);
      mockPrismaService.jobs.count.mockResolvedValue(0);
      mockPrismaService.payments.aggregate.mockResolvedValue({
        _sum: { amount: null },
      });

      // Act
      const result = await service.getOverview();

      // Assert
      expect(result.totalRevenue).toBe(0);
    });
  });

  describe('getUserMetrics', () => {
    it('should return user metrics for last 30 days', async () => {
      // Arrange
      const mockUsersByRole = [
        { role: 'CAREGIVER', _count: 50 },
        { role: 'CLIENT', _count: 30 },
        { role: 'ADMIN', _count: 5 },
      ];

      mockPrismaService.users.count.mockResolvedValue(25);
      mockPrismaService.users.groupBy.mockResolvedValue(mockUsersByRole);

      // Act
      const result = await service.getUserMetrics();

      // Assert
      expect(result).toEqual({
        newUsersLast30Days: 25,
        usersByRole: mockUsersByRole,
        timestamp: expect.any(Date),
      });

      expect(mockPrismaService.users.count).toHaveBeenCalledWith({
        where: { created_at: { gte: expect.any(Date) } },
      });
      expect(mockPrismaService.users.groupBy).toHaveBeenCalledWith({
        by: ['role'],
        _count: true,
      });
    });
  });

  describe('getRevenueMetrics', () => {
    it('should return revenue metrics', async () => {
      // Arrange
      mockPrismaService.payments.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 25000 } }) // monthlyRevenue
        .mockResolvedValueOnce({ _avg: { amount: 500 } }); // avgTransactionValue

      mockPrismaService.payments.count.mockResolvedValue(50);

      // Act
      const result = await service.getRevenueMetrics();

      // Assert
      expect(result).toEqual({
        monthlyRevenue: 25000,
        avgTransactionValue: 500,
        totalTransactions: 50,
        timestamp: expect.any(Date),
      });
    });

    it('should handle null values in aggregates', async () => {
      // Arrange
      mockPrismaService.payments.aggregate
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _avg: { amount: null } });

      mockPrismaService.payments.count.mockResolvedValue(0);

      // Act
      const result = await service.getRevenueMetrics();

      // Assert
      expect(result.monthlyRevenue).toBe(0);
      expect(result.avgTransactionValue).toBe(0);
      expect(result.totalTransactions).toBe(0);
    });
  });

  describe('getCaregiverPerformance', () => {
    it('should return top caregivers with performance data', async () => {
      // Arrange
      const mockCaregivers = [
        {
          id: '1',
          rating_avg: 4.9,
          rating_count: 100,
          total_jobs_completed: 50,
          experience_years: 5,
          users: { name: 'John Doe', phone: '1234567890' },
        },
        {
          id: '2',
          rating_avg: 4.8,
          rating_count: 80,
          total_jobs_completed: 45,
          experience_years: 3,
          users: { name: 'Jane Smith', phone: '0987654321' },
        },
      ];

      mockPrismaService.caregivers.findMany.mockResolvedValue(mockCaregivers);

      // Act
      const result = await service.getCaregiverPerformance();

      // Assert
      expect(result.topCaregivers).toHaveLength(2);
      expect(result.topCaregivers[0]).toEqual({
        id: '1',
        name: 'John Doe',
        rating: 4.9,
        totalRatings: 100,
        jobsCompleted: 50,
        experienceYears: 5,
      });

      expect(mockPrismaService.caregivers.findMany).toHaveBeenCalledWith({
        where: { is_verified: true },
        orderBy: [{ rating_avg: 'desc' }, { rating_count: 'desc' }],
        take: 10,
        include: {
          users: {
            select: { name: true, phone: true },
          },
        },
      });
    });
  });

  describe('getCompanyPerformance', () => {
    it('should return top companies with performance data', async () => {
      // Arrange
      const mockCompanies = [
        {
          id: '1',
          company_name: 'Care Plus',
          rating_avg: 4.7,
          rating_count: 200,
          users: { name: 'Admin User' },
          _count: { jobs: 100, caregivers: 25 },
        },
        {
          id: '2',
          company_name: 'Health Services',
          rating_avg: 4.6,
          rating_count: 150,
          users: { name: 'Company Admin' },
          _count: { jobs: 80, caregivers: 20 },
        },
      ];

      mockPrismaService.companies.findMany.mockResolvedValue(mockCompanies);

      // Act
      const result = await service.getCompanyPerformance();

      // Assert
      expect(result.topCompanies).toHaveLength(2);
      expect(result.topCompanies[0]).toEqual({
        id: '1',
        name: 'Care Plus',
        rating: 4.7,
        totalRatings: 200,
        totalJobs: 100,
        totalCaregivers: 25,
      });

      expect(mockPrismaService.companies.findMany).toHaveBeenCalledWith({
        where: { is_verified: true },
        orderBy: [{ rating_avg: 'desc' }, { rating_count: 'desc' }],
        take: 10,
        include: {
          users: {
            select: { name: true },
          },
          _count: {
            select: { jobs: true, caregivers: true },
          },
        },
      });
    });
  });
});
