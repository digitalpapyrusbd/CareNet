import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole, PayoutMethod } from '@prisma/client';

const mockPrismaService = {
  companies: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  users: {
    update: jest.fn(),
  },
  caregivers: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  packages: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  jobs: {
    count: jest.fn(),
  },
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      company_name: 'Test Agency',
      trade_license: 'TL-123',
      contact_person: 'John Doe',
      contact_phone: '01700000000',
      address: 'Dhaka',
      payout_method: PayoutMethod.BANK_TRANSFER,
      payout_account: '1234567890',
    };
    const userId = 'user-1';

    it('should create a company if user does not have one', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue(null);
      mockPrismaService.companies.create.mockResolvedValue({
        id: 'comp-1',
        ...createDto,
      });
      mockPrismaService.users.update.mockResolvedValue({});

      const result = await service.create(userId, createDto);

      expect(result.id).toBe('comp-1');
      expect(prisma.companies.create).toHaveBeenCalled();
      expect(prisma.users.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          data: { role: UserRole.AGENCY_ADMIN },
        }),
      );
    });

    it('should throw BadRequestException if user already has a company', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue({
        id: 'existing-comp',
      });

      await expect(service.create(userId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated companies', async () => {
      mockPrismaService.companies.findMany.mockResolvedValue([
        { id: 'comp-1' },
      ]);
      mockPrismaService.companies.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by search term', async () => {
      mockPrismaService.companies.findMany.mockResolvedValue([]);
      mockPrismaService.companies.count.mockResolvedValue(0);

      await service.findAll(1, 10, undefined, 'Test');

      expect(prisma.companies.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { company_name: { contains: 'Test', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return company if found', async () => {
      const mockCompany = { id: 'comp-1', company_name: 'Test' };
      mockPrismaService.companies.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOne('comp-1');
      expect(result).toEqual(mockCompany);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue(null);

      await expect(service.findOne('comp-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { company_name: 'New Name' };

    it('should update company if user is owner', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue({
        id: 'comp-1',
        userId: 'user-1',
      });
      mockPrismaService.companies.update.mockResolvedValue({
        id: 'comp-1',
        ...updateDto,
      });

      const result = await service.update(
        'comp-1',
        'user-1',
        UserRole.AGENCY_ADMIN,
        updateDto,
      );

      expect(result.company_name).toBe('New Name');
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue({
        id: 'comp-1',
        userId: 'owner',
      });

      await expect(
        service.update('comp-1', 'user-1', UserRole.CAREGIVER, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow Super Admin to update', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue({
        id: 'comp-1',
        userId: 'owner',
      });
      mockPrismaService.companies.update.mockResolvedValue({
        id: 'comp-1',
        ...updateDto,
      });

      const result = await service.update(
        'comp-1',
        'admin',
        UserRole.SUPER_ADMIN,
        updateDto,
      );

      expect(result.company_name).toBe('New Name');
    });
  });

  describe('verify', () => {
    it('should verify company', async () => {
      mockPrismaService.companies.findUnique.mockResolvedValue({
        id: 'comp-1',
      });
      mockPrismaService.companies.update.mockResolvedValue({
        id: 'comp-1',
        is_verified: true,
      });

      const result = await service.verify('comp-1', {
        verification_notes: 'All good',
      });

      expect(result.is_verified).toBe(true);
      expect(prisma.companies.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ is_verified: true }),
        }),
      );
    });
  });
});
