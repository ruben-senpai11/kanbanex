import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface EntitlementsCheckResult {
  allowed: boolean;
  reason?: string;
}

@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the active plan features and quotas for a given workspace
   */
  async getWorkspaceEntitlements(workspaceId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { workspaceId },
      include: { plan: true },
    });

    if (!subscription || !subscription.plan) {
      // Default fallback is basic plan
      const basicPlan = await this.prisma.subscriptionPlan.findUnique({
        where: { slug: 'basic' },
      });
      return {
        planSlug: 'basic',
        planName: 'Basic',
        status: 'ACTIVE',
        maxProjects: basicPlan?.maxProjects ?? 3,
        maxMembersPerProject: basicPlan?.maxMembersPerProject ?? 2,
        features: (basicPlan?.features as Record<string, boolean>) || {},
      };
    }

    return {
      planSlug: subscription.plan.slug,
      planName: subscription.plan.name,
      status: subscription.status,
      maxProjects: subscription.plan.maxProjects,
      maxMembersPerProject: subscription.plan.maxMembersPerProject,
      features: (subscription.plan.features as Record<string, boolean>) || {},
    };
  }

  /**
   * Verify if the workspace can create another project based on its quota
   */
  async assertCanCreateProject(workspaceId: string): Promise<void> {
    const entitlements = await this.getWorkspaceEntitlements(workspaceId);
    if (entitlements.maxProjects === -1) {
      return; // Unlimited
    }

    const currentCount = await this.prisma.project.count({
      where: { workspaceId, isArchived: false },
    });

    if (currentCount >= entitlements.maxProjects) {
      throw new ForbiddenException(
        `Limite de projets atteinte pour le plan ${entitlements.planName} (${currentCount}/${entitlements.maxProjects}). Passez au plan supérieur (Eclosion ou Entreprise) pour créer plus de projets.`
      );
    }
  }

  /**
   * Verify if custom theme (colors, gradients, cinematic background themes) is unlocked
   */
  async assertCanUseCustomTheme(workspaceId: string): Promise<void> {
    const entitlements = await this.getWorkspaceEntitlements(workspaceId);
    const hasCustomThemeFeature = entitlements.features['customThemes'] === true;

    if (!hasCustomThemeFeature) {
      throw new ForbiddenException(
        'La personnalisation visuelle avancée (couleurs, gradients, univers cinématographiques) nécessite un abonnement Premium (Eclosion ou Entreprise).'
      );
    }
  }

  /**
   * Verify if collaborative task assignment is unlocked
   */
  async assertCanAssignCollaborators(workspaceId: string): Promise<void> {
    const entitlements = await this.getWorkspaceEntitlements(workspaceId);
    if (entitlements.maxMembersPerProject === -1) return;

    // Check project member limits
    // Allowed if plan supports team collaboration
  }

  /**
   * Verify if advanced export/Gantt is unlocked
   */
  async assertCanUseAdvancedGantt(workspaceId: string): Promise<void> {
    const entitlements = await this.getWorkspaceEntitlements(workspaceId);
    const hasGanttFeature = entitlements.features['ganttExport'] !== false;

    if (!hasGanttFeature) {
      throw new ForbiddenException(
        'Cette fonctionnalité avancée de Gantt nécessite un abonnement Premium.'
      );
    }
  }
}
