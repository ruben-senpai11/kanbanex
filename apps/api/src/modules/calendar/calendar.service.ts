import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async getCalendarTasks(projectId: string, start?: string, end?: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Projet introuvable.');

    const dateFilter: any = { projectId, isArchived: false };

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      dateFilter.OR = [
        { dueDate: { gte: startDate, lte: endDate } },
        { startDate: { gte: startDate, lte: endDate } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where: dateFilter,
      orderBy: { dueDate: 'asc' },
      include: {
        list: { select: { id: true, name: true, color: true } },
        assignees: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
        labels: {
          include: { label: true },
        },
      },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      startDate: t.startDate,
      dueDate: t.dueDate,
      dueTime: t.dueTime,
      progressPercentage: t.progressPercentage,
      list: t.list,
      assignees: t.assignees.map((a) => a.user),
      labels: t.labels.map((l) => l.label),
    }));
  }
}
