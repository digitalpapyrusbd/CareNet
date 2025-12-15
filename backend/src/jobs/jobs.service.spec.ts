import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JobStatus, UserRole, AssignmentStatus } from '@prisma/client';

const mockPrismaService = {
  jobs: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  packages: {
    findUnique: jest.fn(),
  },
  patients: {
    findUnique: jest.fn(),
  },
  companies: {
    findUnique: jest.fn(),
  },
  caregivers: {
    findUnique: jest.fn(),
  },
  assignments: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
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
      package_id: 'pkg1',
      patient_id: 'pat1',
      start_date: '2023-01-01',
      end_date: '2023-02-01',
      special_instructions: 'Handle with care',
    };
    const guardianId = 'guardian1';

    it('should create a job if package and patient exist', async () => {
      mockPrismaService.packages.findUnique.mockResolvedValue({
        id: 'pkg1',
        company_id: 'comp1',
        price: 1000,
      });
      mockPrismaService.patients.findUnique.mockResolvedValue({
        id: 'pat1',
        guardian_id: guardianId,
      });
      mockPrismaService.jobs.create.mockResolvedValue({
        id: 'job1',
        status: JobStatus.PENDING_ASSIGNMENT,
      });

      const result = await service.create(guardianId, createDto);

      expect(result.id).toBe('job1');
      expect(prisma.jobs.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            company_id: 'comp1',
            total_price: 1000,
            commission_amount: 100,
          }),
        }),
      );
    });

    it('should throw NotFoundException if package does not exist', async () => {
      mockPrismaService.packages.findUnique.mockResolvedValue(null);

      await expect(service.create(guardianId, createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if patient does not belong to guardian', async () => {
      mockPrismaService.packages.findUnique.mockResolvedValue({
        id: 'pkg1',
        price: 100,
      });
      mockPrismaService.patients.findUnique.mockResolvedValue({
        id: 'pat1',
        guardian_id: 'other-guardian',
      });

      await expect(service.create(guardianId, createDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated jobs based on role', async () => {
      mockPrismaService.jobs.findMany.mockResolvedValue([]);
      mockPrismaService.jobs.count.mockResolvedValue(0);

      const result = await service.findAll('user1', UserRole.GUARDIAN, 1, 10);

      expect(result.data).toEqual([]);
      expect(prisma.jobs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ guardian_id: 'user1' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    const job = {
      id: 'job1',
      guardian_id: 'guardian1',
      company_id: 'comp1',
      assignments: [],
    };

    it('should return job if user is authorized', async () => {
      mockPrismaService.jobs.findUnique.mockResolvedValue(job);

      const result = await service.findOne(
        'job1',
        'guardian1',
        UserRole.GUARDIAN,
      );
      expect(result).toEqual(job);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      mockPrismaService.jobs.findUnique.mockResolvedValue(job);
      mockPrismaService.companies.findUnique.mockResolvedValue(null); // Not an agency admin for this company

      await expect(
        service.findOne('job1', 'other', UserRole.GUARDIAN),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update job if pending and user is guardian', async () => {
      const job = {
        id: 'job1',
        guardian_id: 'guardian1',
        status: JobStatus.PENDING_ASSIGNMENT,
      };
      mockPrismaService.jobs.findUnique.mockResolvedValue(job);
      mockPrismaService.jobs.update.mockResolvedValue({
        ...job,
        special_instructions: 'New',
      });

      await service.update('job1', 'guardian1', {
        special_instructions: 'New',
      });

      expect(prisma.jobs.update).toHaveBeenCalled();
    });

    it('should throw BadRequest if job is not pending', async () => {
      const job = {
        id: 'job1',
        guardian_id: 'guardian1',
        status: JobStatus.ACTIVE,
      };
      mockPrismaService.jobs.findUnique.mockResolvedValue(job);

      await expect(service.update('job1', 'guardian1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('assignCaregivers', () => {
    it('should assign caregivers if user is company admin', async () => {
      const job = { id: 'job1', company_id: 'comp1' };
      const company = { id: 'comp1' };
      mockPrismaService.jobs.findUnique.mockResolvedValue(job);
      mockPrismaService.companies.findUnique.mockResolvedValue(company);
      mockPrismaService.assignments.deleteMany.mockResolvedValue({});
      mockPrismaService.assignments.create.mockResolvedValue({});

      await service.assignCaregivers('job1', 'user1', {
        caregiver_ids: ['cg1'],
      });

      expect(prisma.assignments.create).toHaveBeenCalled();
    });
  });
});
