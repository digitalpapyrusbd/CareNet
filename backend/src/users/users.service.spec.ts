import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole, KYCStatus } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrismaService = {
  users: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [{ id: '1', name: 'Test User' }];
      const mockTotal = 1;

      (prisma.users.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.users.count as jest.Mock).mockResolvedValue(mockTotal);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: mockUsers,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(prisma.users.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found and authorized', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        role: UserRole.CAREGIVER,
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(
        'user-1',
        'user-1',
        UserRole.CAREGIVER,
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.findOne('non-existent', 'user-1', UserRole.CAREGIVER),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user tries to view another profile', async () => {
      const mockUser = { id: 'other-user', role: UserRole.CAREGIVER };
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.findOne('other-user', 'user-1', UserRole.CAREGIVER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow Admin to view any profile', async () => {
      const mockUser = { id: 'other-user', role: UserRole.CAREGIVER };
      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(
        'other-user',
        'admin-id',
        UserRole.SUPER_ADMIN,
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const mockUser = { id: 'user-1', name: 'Old Name' };
      const updatedUser = { id: 'user-1', name: 'New Name' };
      const updateDto = { name: 'New Name' };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.users.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(
        'user-1',
        updateDto,
        'user-1',
        UserRole.CAREGIVER,
      );

      expect(result).toEqual(updatedUser);
    });
  });
});
