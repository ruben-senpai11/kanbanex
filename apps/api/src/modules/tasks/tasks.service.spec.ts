import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TaskStatus, Priority } from '@prisma/client';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      task: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      list: {
        findUnique: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
      },
      activityLog: {
        create: jest.fn(),
      },
      taskAssignee: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
      taskDependency: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTaskDetails', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.getTaskDetails('task-invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return task with details when found', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Lancer l\'offre maîtresse',
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
      };
      prisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.getTaskDetails('task-1');
      expect(result.id).toBe('task-1');
      expect(result.title).toBe('Lancer l\'offre maîtresse');
    });
  });

  describe('createTask', () => {
    it('should throw NotFoundException if column list does not exist', async () => {
      prisma.list.findUnique.mockResolvedValue(null);

      await expect(
        service.createTask('invalid-list', 'u-1', {
          title: 'Nouvelle tâche',
          priority: Priority.HIGH,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create task and log activity in project', async () => {
      prisma.list.findUnique.mockResolvedValue({
        id: 'list-1',
        name: 'À faire',
        board: { projectId: 'proj-1' },
      });
      prisma.task.findFirst.mockResolvedValue({ position: 1000 });
      prisma.task.create.mockResolvedValue({
        id: 'task-new',
        listId: 'list-1',
        projectId: 'proj-1',
        title: 'Priorité Domino #1',
        position: 2000,
      });
      prisma.project.findUnique.mockResolvedValue({
        id: 'proj-1',
        workspaceId: 'ws-1',
      });
      prisma.activityLog.create.mockResolvedValue({ id: 'act-1' });

      const result = await service.createTask('list-1', 'u-1', {
        title: 'Priorité Domino #1',
        priority: Priority.URGENT,
      });

      expect(result.id).toBe('task-new');
      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            listId: 'list-1',
            projectId: 'proj-1',
            title: 'Priorité Domino #1',
            position: 2000,
          }),
        }),
      );
      expect(prisma.activityLog.create).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should automatically set completedAt and progressPercentage to 100 when status is DONE', async () => {
      prisma.task.findUnique.mockResolvedValue({
        id: 'task-1',
        status: TaskStatus.IN_PROGRESS,
      });
      prisma.task.update.mockResolvedValue({
        id: 'task-1',
        status: TaskStatus.DONE,
        progressPercentage: 100,
      });

      const result = await service.updateTask('task-1', 'u-1', {
        status: TaskStatus.DONE,
      });

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'task-1' },
          data: expect.objectContaining({
            status: TaskStatus.DONE,
            progressPercentage: 100,
            completedAt: expect.any(Date),
          }),
        }),
      );
      expect(result.status).toBe(TaskStatus.DONE);
    });
  });

  describe('moveTask', () => {
    it('should detect destination column name "Terminé" and set status to DONE', async () => {
      prisma.task.findUnique.mockResolvedValue({
        id: 'task-1',
        status: TaskStatus.IN_PROGRESS,
      });
      prisma.list.findUnique.mockResolvedValue({
        id: 'list-done',
        name: 'Terminé',
      });
      prisma.task.update.mockResolvedValue({
        id: 'task-1',
        listId: 'list-done',
        status: TaskStatus.DONE,
      });

      await service.moveTask('task-1', 'u-1', {
        targetListId: 'list-done',
        targetPosition: 1000,
      });

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            listId: 'list-done',
            status: TaskStatus.DONE,
            completedAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe('setDependency', () => {
    it('should throw BadRequestException if task depends on itself', async () => {
      await expect(
        service.setDependency('task-1', {
          predecessorTaskId: 'task-1',
          dependencyType: 'FINISH_TO_START',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
