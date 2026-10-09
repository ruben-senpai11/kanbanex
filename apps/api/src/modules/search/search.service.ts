import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchFilterParams {
  query?: string;
  projectId?: string;
  assigneeId?: string;
  labelId?: string;
  status?: any;
  priority?: any;
  isOverdue?: boolean;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(workspaceId: string, params: SearchFilterParams) {
    const q = params.query?.trim();

    // 1. Search Projects
    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
        isArchived: false,
        ...(q && {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }),
      },
      take: 15,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        priority: true,
        customColor: true,
        customGradient: true,
        backgroundTheme: true,
      },
    });

    // 2. Search Tasks with filters
    const taskWhere: any = {
      project: { workspaceId },
      isArchived: false,
    };

    if (params.projectId) {
      taskWhere.projectId = params.projectId;
    }

    if (q) {
      taskWhere.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const validStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    if (params.status && validStatuses.includes(params.status)) {
      taskWhere.status = params.status;
    }

    if (params.priority && validPriorities.includes(params.priority)) {
      taskWhere.priority = params.priority;
    }

    if (params.assigneeId) {
      taskWhere.assignees = {
        some: { userId: params.assigneeId },
      };
    }

    if (params.labelId) {
      taskWhere.labels = {
        some: { labelId: params.labelId },
      };
    }

    if (params.isOverdue) {
      taskWhere.dueDate = { lt: new Date() };
      taskWhere.status = { not: 'DONE' };
    }

    const tasks = await this.prisma.task.findMany({
      where: taskWhere,
      take: 25,
      orderBy: { updatedAt: 'desc' },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        list: { select: { id: true, name: true, color: true } },
        assignees: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
        labels: { include: { label: true } },
      },
    });

    return {
      projects,
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        project: t.project,
        list: t.list,
        assignees: t.assignees.map((a) => a.user),
        labels: t.labels.map((l) => l.label),
      })),
    };
  }
}
