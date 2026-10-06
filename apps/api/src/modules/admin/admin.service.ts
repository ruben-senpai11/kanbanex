import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlanDto, UpdateUserRoleDto, UpdateSystemSettingDto } from './dto/admin.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Global platform statistics for SuperAdmin dashboard
   */
  async getPlatformStats() {
    const [totalUsers, totalWorkspaces, totalProjects, totalTasks, transactions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.workspace.count(),
      this.prisma.project.count({ where: { isArchived: false } }),
      this.prisma.task.count({ where: { isArchived: false } }),
      this.prisma.paymentTransaction.findMany({
        where: { status: PaymentStatus.APPROVED },
        select: { amount: true, currency: true },
      }),
    ]);

    const totalRevenueCFA = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalUsers,
      totalWorkspaces,
      totalProjects,
      totalTasks,
      totalRevenueCFA,
      approvedTransactionsCount: transactions.length,
    };
  }

  /**
   * Users Management
   */
  async getUsersList(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { fullName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          _count: {
            select: { workspaceMembers: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
    });
  }

  /**
   * Plans & Pricing Management
   */
  async getAllPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async updatePlan(planId: string, dto: UpdatePlanDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan introuvable.');

    return this.prisma.subscriptionPlan.update({
      where: { id: planId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.description && { description: dto.description.trim() }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.maxProjects !== undefined && { maxProjects: dto.maxProjects }),
        ...(dto.maxMembersPerProject !== undefined && { maxMembersPerProject: dto.maxMembersPerProject }),
        ...(dto.features && { features: dto.features }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  /**
   * System Transactions Audit
   */
  async getAllTransactions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          workspace: { select: { id: true, name: true, slug: true } },
          plan: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.paymentTransaction.count(),
    ]);

    return { transactions, total, page, limit };
  }

  /**
   * Dynamic System Settings Management
   */
  async getSystemSettings() {
    return this.prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async updateSystemSetting(dto: UpdateSystemSettingDto) {
    return this.prisma.systemSetting.upsert({
      where: { key: dto.key },
      create: {
        key: dto.key,
        value: dto.value,
        description: dto.description,
      },
      update: {
        value: dto.value,
        ...(dto.description && { description: dto.description }),
      },
    });
  }
}
