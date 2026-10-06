import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/labels.dto';

@Injectable()
export class LabelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkspaceLabels(workspaceId: string) {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async createLabel(workspaceId: string, dto: CreateLabelDto) {
    return this.prisma.label.create({
      data: {
        workspaceId,
        name: dto.name.trim(),
        color: dto.color,
        icon: dto.icon,
        description: dto.description?.trim(),
      },
    });
  }

  async attachToTask(taskId: string, labelId: string) {
    return this.prisma.taskLabel.upsert({
      where: { taskId_labelId: { taskId, labelId } },
      create: { taskId, labelId },
      update: {},
      include: { label: true },
    });
  }

  async detachFromTask(taskId: string, labelId: string) {
    await this.prisma.taskLabel.deleteMany({
      where: { taskId, labelId },
    });
    return { success: true };
  }

  async deleteLabel(labelId: string) {
    await this.prisma.label.delete({ where: { id: labelId } });
    return { success: true };
  }
}
