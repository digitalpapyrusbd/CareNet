import { Test, TestingModule } from '@nestjs/testing';
import { CaregiversService } from './caregivers.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole, Gender } from '@prisma/client';

const mockPrismaService = {
  caregivers: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  users: {
    update: jest.fn(),
  },
};

describe('CaregiversService', () => {
  let service: CaregiversService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaregiversService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CaregiversService>(CaregiversService);
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
      nid: '1234567890',
      nid_url: 'http://example.com/nid.jpg',
      photo_url: 'http://example.com/photo.jpg',
      date_of_birth: '1990-01-01',
      gender: Gender.MALE,
      address: 'Dhaka',
      skills: ['Nursing'],
    };
    const userId = 'user-1';

    it('should create a caregiver profile if one does not exist', async () => {
      mockPrismaService.caregivers.findUnique.mockResolvedValue(null);
      mockPrismaService.caregivers.create.mockResolvedValue({
        id: 'cg-1',
        ...createDto,
      });
      mockPrismaService.users.update.mockResolvedValue({});

      const result = await service.create(userId, createDto);

      expect(result.id).toBe('cg-1');
      expect(prisma.caregivers.create).toHaveBeenCalled();
      expect(prisma.users.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          data: { role: UserRole.CAREGIVER },
        }),
      );
    });

    it('should throw BadRequestException if profile already exists', async () => {
      mockPrismaService.caregivers.findUnique.mockResolvedValue({
        id: 'existing',
      });

      await expect(service.create(userId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated caregivers', async () => {
      mockPrismaService.caregivers.findMany.mockResolvedValue([{ id: 'cg-1' }]);
      mockPrismaService.caregivers.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter be enabled conditions', async () => {
      mockPrismaService.caregivers.findMany.mockResolvedValue([]);
      mockPrismaService.caregivers.count.mockResolvedValue(0);

      await service.findAll(1, 10, { isVerified: true, isAvailable: false });

      expect(prisma.caregivers.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            is_verified: true,
            is_available: false,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return caregiver if found', async () => {
      const mockCaregiver = { id: 'cg-1' };
      mockPrismaService.caregivers.findUnique.mockResolvedValue(mockCaregiver);

      const result = await service.findOne('cg-1');
      expect(result).toEqual(mockCaregiver);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.caregivers.findUnique.mockResolvedValue(null);

      await expect(service.findOne('cg-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto = { address: 'New Address' };
    const userId = 'user-1';

    it('should update caregiver if user owns profile', async () => {
      mockPrismaService.caregivers.findUnique.mockResolvedValue({
        id: 'cg-1',
        userId,
      });
      mockPrismaService.caregivers.update.mockResolvedValue({
        id: 'cg-1',
        ...updateDto,
      });

      const result = await service.update('cg-1', userId, updateDto);

      expect(result.address).toBe('New Address');
    });

    it('should throw NotFoundException if user does not own profile', async () => {
      mockPrismaService.caregivers.findUnique.mockResolvedValue({
        id: 'cg-1',
        userId: 'other',
      });

      await expect(service.update('cg-1', userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
