import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteMemberDto } from './dto/workspaces.dto';
import { WorkspaceRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all workspaces the user is a member of
   */
  async getUserWorkspaces(userId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
            _count: {
              select: {
                projects: { where: { isArchived: false } },
                members: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((m) => ({
      ...m.workspace,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  /**
   * Get workspace details and verify membership
   */
  async getWorkspaceById(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      include: {
        workspace: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('Accès refusé. Vous n\'êtes pas membre de cet espace de travail.');
    }

    return {
      ...member.workspace,
      currentUserRole: member.role,
    };
  }

  /**
   * Create a new workspace
   */
  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const baseSlug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'workspace';
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim(),
        ownerId: userId,
        members: {
          create: {
            userId,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    });

    // Attach subscription plan (SUPER_ADMIN gets enterprise/expansion plan by default)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan =
      (await this.prisma.subscriptionPlan.findFirst({
        where: {
          slug: {
            in:
              user?.role === 'SUPER_ADMIN'
                ? ['expansion', 'entreprise', 'enterprise']
                : ['visionnaire', 'starter', 'basic'],
          },
        },
      })) || (await this.prisma.subscriptionPlan.findFirst());

    if (plan) {
      await this.prisma.subscription.create({
        data: {
          workspaceId: workspace.id,
          planId: plan.id,
          status: 'ACTIVE',
        },
      });
    }

    return workspace;
  }

  /**
   * Update workspace details
   */
  async updateWorkspace(workspaceId: string, userId: string, dto: UpdateWorkspaceDto) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    if (!member || (member.role !== WorkspaceRole.OWNER && member.role !== WorkspaceRole.ADMIN)) {
      throw new ForbiddenException('Permissions insuffisantes pour modifier cet espace.');
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
      },
    });
  }

  /**
   * Invite member to workspace
   */
  async inviteMember(workspaceId: string, inviterId: string, dto: InviteMemberDto) {
    const inviterMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: inviterId } },
    });

    if (!inviterMember || (inviterMember.role !== WorkspaceRole.OWNER && inviterMember.role !== WorkspaceRole.ADMIN)) {
      throw new ForbiddenException('Seuls les administrateurs et propriétaires peuvent inviter des membres.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!targetUser) {
      throw new NotFoundException(`Aucun compte KanbanEX trouvé pour l'email ${dto.email}.`);
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: targetUser.id } },
    });

    if (existingMember) {
      throw new ConflictException('Cet utilisateur est déjà membre de l\'espace de travail.');
    }

    const newMember = await this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role: dto.role || WorkspaceRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return newMember;
  }

  /**
   * Remove member from workspace
   */
  async removeMember(workspaceId: string, actorId: string, targetUserId: string) {
    const actorMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: actorId } },
    });

    if (!actorMember || (actorMember.role !== WorkspaceRole.OWNER && actorMember.role !== WorkspaceRole.ADMIN)) {
      throw new ForbiddenException('Permissions insuffisantes pour retirer un membre.');
    }

    if (actorId === targetUserId) {
      throw new ForbiddenException('Vous ne pouvez pas vous retirer vous-même. Transférez la propriété d\'abord.');
    }

    await this.prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    });

    return { success: true, message: 'Membre retiré avec succès.' };
  }
}
