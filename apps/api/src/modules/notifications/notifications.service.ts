import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string) {
    const list = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    // If new user with 0 notifications, seed initial welcome notifications
    if (list.length === 0) {
      return this.seedDefaultNotifications(userId);
    }

    return list;
  }

  private async seedDefaultNotifications(userId: string) {
    const samples = [
      {
        userId,
        title: 'Bienvenue sur KanbanEx 🎉',
        message: 'Votre espace de travail est prêt à l\'emploi. Organisez vos projets avec fluidité et élégance.',
        type: 'WELCOME',
        entityType: 'WORKSPACE',
        isRead: false,
      },
      {
        userId,
        title: 'Plan Entreprise Actif ⭐',
        message: 'Toutes les fonctionnalités avancées (vues Kanban, Gantt, Calendrier et thèmes illimités) sont activées.',
        type: 'SUBSCRIPTION',
        entityType: 'PLAN',
        isRead: false,
      },
      {
        userId,
        title: 'Tableau Kanban initialisé 🚀',
        message: 'Déplacez des cartes, ajoutez des colonnes ou planifiez des dates en un clic.',
        type: 'PROJECT',
        entityType: 'BOARD',
        isRead: true,
      },
    ];

    await this.prisma.notification.createMany({
      data: samples,
    });

    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNotification(dto: {
    userId: string;
    title: string;
    message: string;
    type: string;
    entityType?: string;
    entityId?: string;
  }) {
    return this.prisma.notification.create({
      data: dto,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }
}
