import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectActivity(projectId: string, limit = 20) {
    return this.prisma.activityLog.findMany({
      where: { projectId },
      take: Math.min(limit, 50),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async getWorkspaceActivity(workspaceId: string, limit = 30) {
    return this.prisma.activityLog.findMany({
      where: { workspaceId },
      take: Math.min(limit, 50),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        project: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }
}
