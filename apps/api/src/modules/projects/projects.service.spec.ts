import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { EntitlementsService } from '../entitlements/entitlements.service';
import { TaskStatus } from '@prisma/client';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: any;
  let entitlements: any;

  beforeEach(async () => {
    prisma = {
      workspaceMember: { findUnique: jest.fn() },
      project: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
      user: { findUnique: jest.fn() },
      activityLog: { create: jest.fn() },
    };

    entitlements = {
      assertCanCreateProject: jest.fn(),
      assertCanUseCustomTheme: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EntitlementsService, useValue: entitlements },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should compute exact metrics in getProjectsOverview without dummy data', async () => {
    prisma.workspaceMember.findUnique.mockResolvedValue({ role: 'MEMBER' });
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', fullName: 'Initiateur Test' });

    const pastDate = new Date(Date.now() - 86400000 * 5);
    const futureDate = new Date(Date.now() + 86400000 * 5);

    prisma.project.findMany.mockResolvedValue([
      {
        id: 'proj-1',
        workspaceId: 'ws-1',
        name: 'Projet Test Alpha',
        slug: 'projet-test-alpha',
        description: 'Projet de test',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        ownerId: 'user-1',
        position: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        tasks: [
          { id: 't1', status: TaskStatus.DONE, dueDate: pastDate, labels: [] },
          { id: 't2', status: TaskStatus.IN_PROGRESS, dueDate: pastDate, labels: [] }, // Overdue
          { id: 't3', status: TaskStatus.TODO, dueDate: futureDate, labels: [] },
        ],
        activityLogs: [],
      },
    ]);

    const result = await service.getProjectsOverview('ws-1', 'user-1');
    expect(result).toHaveLength(1);
    expect(result[0].metrics.totalTasks).toBe(3);
    expect(result[0].metrics.completedTasks).toBe(1);
    expect(result[0].metrics.overdueTasks).toBe(1);
    expect(result[0].metrics.inProgressTasks).toBe(1);
    expect(result[0].metrics.progressPercentage).toBe(33); // 1/3 = 33%
    expect(result[0].nextDeadline).toEqual(futureDate);
  });
});
