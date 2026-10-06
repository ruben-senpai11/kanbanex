import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGanttDatesDto } from './dto/gantt.dto';

@Injectable()
export class GanttService {
  constructor(private readonly prisma: PrismaService) {}

  async getGanttData(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        plannedStartDate: true,
        plannedEndDate: true,
        actualStartDate: true,
        actualEndDate: true,
      },
    });

    if (!project) throw new NotFoundException('Projet introuvable.');

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
        isArchived: false,
      },
      orderBy: [
        { startDate: 'asc' },
        { dueDate: 'asc' },
        { position: 'asc' },
      ],
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
        predecessors: {
          select: {
            predecessorTaskId: true,
            dependencyType: true,
          },
        },
        successors: {
          select: {
            successorTaskId: true,
            dependencyType: true,
          },
        },
      },
    });

    return {
      project,
      tasks: tasks.map((t) => {
        // Ensure standard dates for Gantt visualization
        const start = t.startDate || t.createdAt;
        const due = t.dueDate || new Date(new Date(start).getTime() + 86400000 * 3);

        return {
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          startDate: start,
          dueDate: due,
          progressPercentage: t.progressPercentage,
          estimatedHours: t.estimatedHours,
          actualHours: t.actualHours,
          list: t.list,
          assignees: t.assignees.map((a) => a.user),
          labels: t.labels.map((l) => l.label),
          dependencies: t.predecessors.map((p) => ({
            fromTaskId: p.predecessorTaskId,
            toTaskId: t.id,
            type: p.dependencyType,
          })),
        };
      }),
    };
  }

  async updateTaskDates(taskId: string, dto: UpdateGanttDatesDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tâche introuvable.');

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        startDate: new Date(dto.startDate),
        dueDate: new Date(dto.dueDate),
        ...(dto.progressPercentage !== undefined && { progressPercentage: dto.progressPercentage }),
      },
      include: {
        assignees: {
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
        },
        labels: { include: { label: true } },
      },
    });
  }
}
