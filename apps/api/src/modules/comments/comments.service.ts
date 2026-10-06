import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async addComment(taskId: string, userId: string, content: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task) throw new NotFoundException('Tâche introuvable.');

    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    // Record activity
    await this.prisma.activityLog.create({
      data: {
        workspaceId: task.project.workspaceId,
        projectId: task.project.id,
        taskId: task.id,
        userId,
        action: 'COMMENTAIRE_AJOUTE',
        entityType: 'COMMENT',
        entityId: comment.id,
        details: { taskTitle: task.title, contentPreview: content.substring(0, 80) },
      },
    });

    return comment;
  }
}
