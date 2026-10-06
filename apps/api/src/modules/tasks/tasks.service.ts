import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
  SetDependencyDto,
} from './dto/tasks.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get single task with all nested relations for the Task Detail Drawer
   */
  async getTaskDetails(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        list: true,
        project: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, fullName: true, avatarUrl: true, email: true },
                },
              },
            },
          },
        },
        assignees: {
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true, email: true },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        checklists: {
          orderBy: { position: 'asc' },
          include: {
            items: {
              orderBy: { position: 'asc' },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
          include: {
            uploader: {
              select: { id: true, fullName: true },
            },
          },
        },
        predecessors: {
          include: {
            predecessor: {
              select: { id: true, title: true, status: true, dueDate: true },
            },
          },
        },
        successors: {
          include: {
            successor: {
              select: { id: true, title: true, status: true, dueDate: true },
            },
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Tâche introuvable.');
    return task;
  }

  /**
   * Create a new task within a list
   */
  async createTask(listId: string, userId: string, dto: CreateTaskDto) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list) throw new NotFoundException('Colonne introuvable.');

    const lastTask = await this.prisma.task.findFirst({
      where: { listId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (lastTask?.position ?? 0) + 1000;

    const task = await this.prisma.task.create({
      data: {
        listId,
        projectId: list.board.projectId,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        priority: dto.priority,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        dueTime: dto.dueTime,
        estimatedHours: dto.estimatedHours,
        position,
        assignees: dto.assigneeIds?.length
          ? {
              create: dto.assigneeIds.map((uId) => ({ userId: uId })),
            }
          : undefined,
        labels: dto.labelIds?.length
          ? {
              create: dto.labelIds.map((lId) => ({ labelId: lId })),
            }
          : undefined,
      },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
        labels: {
          include: { label: true },
        },
        checklists: {
          include: { items: true },
        },
        _count: {
          select: { comments: true, attachments: true },
        },
      },
    });

    // Log Activity
    const project = await this.prisma.project.findUnique({ where: { id: list.board.projectId } });
    if (project) {
      await this.prisma.activityLog.create({
        data: {
          workspaceId: project.workspaceId,
          projectId: project.id,
          taskId: task.id,
          userId,
          action: 'TACHE_CREEE',
          entityType: 'TASK',
          entityId: task.id,
          details: { taskTitle: task.title, listName: list.name },
        },
      });
    }

    return task;
  }

  /**
   * Update task properties (title, description, dates, progress, status, priority)
   */
  async updateTask(taskId: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task) throw new NotFoundException('Tâche introuvable.');

    const isNowDone = dto.status === TaskStatus.DONE;

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.startDate !== undefined && {
          startDate: dto.startDate ? new Date(dto.startDate) : null,
        }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.dueTime !== undefined && { dueTime: dto.dueTime }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.actualHours !== undefined && { actualHours: dto.actualHours }),
        ...(dto.progressPercentage !== undefined && { progressPercentage: dto.progressPercentage }),
        ...(dto.position !== undefined && { position: dto.position }),
        ...(isNowDone && { completedAt: new Date(), progressPercentage: 100 }),
      },
      include: {
        assignees: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
        labels: { include: { label: true } },
      },
    });

    return updatedTask;
  }

  /**
   * Move task across columns or within column (Drag & Drop)
   */
  async moveTask(taskId: string, userId: string, dto: MoveTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tâche introuvable.');

    const targetList = await this.prisma.list.findUnique({ where: { id: dto.targetListId } });
    if (!targetList) throw new NotFoundException('Colonne de destination introuvable.');

    // Auto-detect status if destination column indicates it
    let targetStatus = dto.targetStatus || task.status;
    const lowerName = targetList.name.toLowerCase();
    if (lowerName.includes('termin') || lowerName.includes('done')) {
      targetStatus = TaskStatus.DONE;
    } else if (lowerName.includes('cours') || lowerName.includes('progress')) {
      targetStatus = TaskStatus.IN_PROGRESS;
    } else if (lowerName.includes('review') || lowerName.includes('revue')) {
      targetStatus = TaskStatus.IN_REVIEW;
    } else if (lowerName.includes('bloqu') || lowerName.includes('block')) {
      targetStatus = TaskStatus.BLOCKED;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        listId: dto.targetListId,
        position: dto.targetPosition,
        status: targetStatus,
        completedAt: targetStatus === TaskStatus.DONE ? new Date() : null,
      },
    });
  }

  /**
   * Assign user to task
   */
  async assignUser(taskId: string, targetUserId: string) {
    return this.prisma.taskAssignee.upsert({
      where: { taskId_userId: { taskId, userId: targetUserId } },
      create: { taskId, userId: targetUserId },
      update: {},
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true, email: true } },
      },
    });
  }

  /**
   * Unassign user from task
   */
  async unassignUser(taskId: string, targetUserId: string) {
    await this.prisma.taskAssignee.deleteMany({
      where: { taskId, userId: targetUserId },
    });
    return { success: true };
  }

  /**
   * Checklists Management
   */
  async addChecklist(taskId: string, dto: CreateChecklistDto) {
    return this.prisma.checklist.create({
      data: {
        taskId,
        title: dto.title.trim(),
      },
      include: { items: true },
    });
  }

  async addChecklistItem(checklistId: string, dto: CreateChecklistItemDto) {
    return this.prisma.checklistItem.create({
      data: {
        checklistId,
        content: dto.content.trim(),
      },
    });
  }

  async toggleChecklistItem(itemId: string, dto: UpdateChecklistItemDto) {
    return this.prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        ...(dto.isCompleted !== undefined && { isCompleted: dto.isCompleted }),
        ...(dto.content && { content: dto.content.trim() }),
      },
    });
  }

  async deleteChecklist(checklistId: string) {
    await this.prisma.checklist.delete({ where: { id: checklistId } });
    return { success: true };
  }

  /**
   * Dependencies Management (Gantt Predecessor/Successor)
   */
  async setDependency(successorTaskId: string, dto: SetDependencyDto) {
    if (successorTaskId === dto.predecessorTaskId) {
      throw new BadRequestException('Une tâche ne peut pas dépendre d\'elle-même.');
    }

    return this.prisma.taskDependency.upsert({
      where: {
        predecessorTaskId_successorTaskId: {
          predecessorTaskId: dto.predecessorTaskId,
          successorTaskId,
        },
      },
      create: {
        predecessorTaskId: dto.predecessorTaskId,
        successorTaskId,
        dependencyType: dto.dependencyType,
      },
      update: {
        dependencyType: dto.dependencyType,
      },
    });
  }

  async removeDependency(predecessorTaskId: string, successorTaskId: string) {
    await this.prisma.taskDependency.deleteMany({
      where: { predecessorTaskId, successorTaskId },
    });
    return { success: true };
  }

  /**
   * Delete Task
   */
  async deleteTask(taskId: string, userId: string) {
    await this.prisma.task.delete({ where: { id: taskId } });
    return { success: true, message: 'Tâche supprimée.' };
  }
}
