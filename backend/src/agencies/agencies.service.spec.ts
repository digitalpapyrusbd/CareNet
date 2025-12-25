import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from './agencies.service';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserRole, PayoutMethod } from '@prisma/client';

const mockPrismaService = {
  agencies: {
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

describe('AgenciesService', () => {
  let service: AgenciesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgenciesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
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
      agency_name: 'Test Agency',
      trade_license: 'TL-123',
      contact_person: 'John Doe',
      contact_phone: '01700000000',
      address: 'Dhaka',
      payout_method: PayoutMethod.BANK_TRANSFER,
      payout_account: '1234567890',
    };
    const userId = 'user-1';

    it('should create an agency if user does not have one', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue(null);
      mockPrismaService.agencies.create.mockResolvedValue({
        id: 'agency-1',
        ...createDto,
      });
      mockPrismaService.users.update.mockResolvedValue({});

      const result = await service.create(userId, createDto);

      expect(result.id).toBe('agency-1');
      expect(prisma.agencies.create).toHaveBeenCalled();
      expect(prisma.users.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          data: { role: UserRole.AGENCY },
        }),
      );
    });

    it('should throw BadRequestException if user already has an agency', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue({
        id: 'existing-agency',
      });

      await expect(service.create(userId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated agencies', async () => {
      mockPrismaService.agencies.findMany.mockResolvedValue([
        { id: 'agency-1' },
      ]);
      mockPrismaService.agencies.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by search term', async () => {
      mockPrismaService.agencies.findMany.mockResolvedValue([]);
      mockPrismaService.agencies.count.mockResolvedValue(0);

      await service.findAll(1, 10, undefined, 'Test');

      expect(prisma.agencies.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { agency_name: { contains: 'Test', mode: 'insensitive' } },
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return agency if found', async () => {
      const mockAgency = { id: 'agency-1', agency_name: 'Test' };
      mockPrismaService.agencies.findUnique.mockResolvedValue(mockAgency);

      const result = await service.findOne('agency-1');
      expect(result).toEqual(mockAgency);
    });

    it('should throw NotFoundException if agency not found', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue(null);

      await expect(service.findOne('agency-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = { agency_name: 'New Name' };

    it('should update agency if user is owner', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue({
        id: 'agency-1',
        userId: 'user-1',
      });
      mockPrismaService.agencies.update.mockResolvedValue({
        id: 'agency-1',
        ...updateDto,
      });

      const result = await service.update(
        'agency-1',
        'user-1',
        UserRole.AGENCY,
        updateDto,
      );

      expect(result.agency_name).toBe('New Name');
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue({
        id: 'agency-1',
        userId: 'owner',
      });

      await expect(
        service.update('agency-1', 'user-1', UserRole.CAREGIVER, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow Super Admin to update', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue({
        id: 'agency-1',
        userId: 'owner',
      });
      mockPrismaService.agencies.update.mockResolvedValue({
        id: 'agency-1',
        ...updateDto,
      });

      const result = await service.update(
        'agency-1',
        'admin',
        UserRole.SUPER_ADMIN,
        updateDto,
      );

      expect(result.agency_name).toBe('New Name');
    });
  });

  describe('verify', () => {
    it('should verify agency', async () => {
      mockPrismaService.agencies.findUnique.mockResolvedValue({
        id: 'agency-1',
      });
      mockPrismaService.agencies.update.mockResolvedValue({
        id: 'agency-1',
        is_verified: true,
      });

      const result = await service.verify('agency-1', {
        verification_notes: 'All good',
      });

      expect(result.is_verified).toBe(true);
      expect(prisma.agencies.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ is_verified: true }),
        }),
      );
    });
  });
});
