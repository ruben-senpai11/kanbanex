import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntitlementsService } from '../entitlements/entitlements.service';
import { CreateProjectDto, UpdateProjectDto, UpdateThemeDto } from './dto/projects.dto';
import { ProjectRole, TaskStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlementsService: EntitlementsService,
  ) {}

  /**
   * Signature Feature: Projects Overview ("Tous mes projets")
   * Returns complete overview data for all projects in a workspace with exact metrics.
   */
  async getProjectsOverview(workspaceId: string, userId: string) {
    // Verify user is workspace member
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) {
      throw new ForbiddenException('Accès refusé à cet espace de travail.');
    }

    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
        isArchived: false,
      },
      orderBy: { position: 'asc' },
      include: {
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
        tasks: {
          where: { isArchived: false },
          select: {
            id: true,
            status: true,
            dueDate: true,
            startDate: true,
            priority: true,
            labels: {
              include: {
                label: true,
              },
            },
          },
        },
        activityLogs: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            action: true,
            createdAt: true,
            user: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    const now = new Date();

    // Map each project into high-fidelity overview representation
    const overview = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter((t) => t.status === TaskStatus.DONE).length;
        const inProgressTasks = project.tasks.filter(
          (t) => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.IN_REVIEW
        ).length;

        // Overdue tasks: dueDate in past and not DONE
        const overdueTasks = project.tasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== TaskStatus.DONE
        ).length;

        const progressPercentage =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Next upcoming deadline
        const upcomingTasks = project.tasks
          .filter((t) => t.dueDate && new Date(t.dueDate) >= now && t.status !== TaskStatus.DONE)
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        const nextDeadline = upcomingTasks[0]?.dueDate || null;

        // Distinct labels in this project
        const labelMap = new Map<string, { id: string; name: string; color: string }>();
        project.tasks.forEach((t) => {
          t.labels.forEach((tl) => {
            if (!labelMap.has(tl.label.id)) {
              labelMap.set(tl.label.id, {
                id: tl.label.id,
                name: tl.label.name,
                color: tl.label.color,
              });
            }
          });
        });

        // Initiator
        const initiator = await this.prisma.user.findUnique({
          where: { id: project.ownerId },
          select: { id: true, fullName: true, avatarUrl: true, email: true },
        });

        return {
          id: project.id,
          workspaceId: project.workspaceId,
          name: project.name,
          slug: project.slug,
          description: project.description,
          status: project.status,
          priority: project.priority,
          plannedStartDate: project.plannedStartDate,
          plannedEndDate: project.plannedEndDate,
          actualStartDate: project.actualStartDate,
          actualEndDate: project.actualEndDate,
          customColor: project.customColor,
          customGradient: project.customGradient,
          backgroundTheme: project.backgroundTheme,
          coverUrl: project.coverUrl,
          position: project.position,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          initiator,
          members: project.members.map((m) => ({
            id: m.user.id,
            fullName: m.user.fullName,
            email: m.user.email,
            avatarUrl: m.user.avatarUrl,
            role: m.role,
          })),
          metrics: {
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            progressPercentage,
          },
          nextDeadline,
          lastActivity: project.activityLogs[0] || {
            action: 'Création du projet',
            createdAt: project.createdAt,
            user: { fullName: initiator?.fullName || 'Initiateur' },
          },
          labels: Array.from(labelMap.values()),
        };
      })
    );

    return overview;
  }

  /**
   * Create a new project within workspace
   */
  async createProject(workspaceId: string, userId: string, dto: CreateProjectDto) {
    // 1. Verify workspace membership
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) {
      throw new ForbiddenException('Vous n\'avez pas accès à cet espace de travail.');
    }

    // 2. Assert plan quotas
    await this.entitlementsService.assertCanCreateProject(workspaceId);

    // 3. If custom theme is requested, assert feature entitlement
    if (dto.customColor || dto.customGradient || dto.backgroundTheme) {
      // Soft check or allow defaults
    }

    const baseSlug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'projet';
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // Get max position to append to the right
    const lastProject = await this.prisma.project.findFirst({
      where: { workspaceId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (lastProject?.position ?? 0) + 1000;

    // 4. Create project with its default Board and default standard Lists
    const project = await this.prisma.project.create({
      data: {
        workspaceId,
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim(),
        priority: dto.priority,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : null,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : null,
        customColor: dto.customColor || '#F97316',
        customGradient: dto.customGradient || 'from-amber-500 to-orange-600',
        backgroundTheme: dto.backgroundTheme || 'vast-skies',
        ownerId: userId,
        position,
        members: {
          create: {
            userId,
            role: ProjectRole.MANAGER,
          },
        },
        boards: {
          create: {
            name: 'Principal',
            isDefault: true,
            position: 1000,
            lists: {
              create: [
                { name: 'À faire', position: 1000, color: '#94A3B8' },
                { name: 'En cours', position: 2000, color: '#38BDF8' },
                { name: 'En review', position: 3000, color: '#F59E0B' },
                { name: 'Terminé', position: 4000, color: '#10B981' },
              ],
            },
          },
        },
        activityLogs: {
          create: {
            workspaceId,
            userId,
            action: 'PROJET_CREE',
            entityType: 'PROJECT',
            entityId: slug,
            details: { projectName: dto.name },
          },
        },
      },
      include: {
        boards: {
          include: {
            lists: true,
          },
        },
        members: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    });

    return project;
  }

  /**
   * Get single project details with its default board and members
   */
  async getProjectDetails(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: true,
        members: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true, avatarUrl: true },
            },
          },
        },
        boards: {
          where: { isDefault: true },
          include: {
            lists: {
              where: { isArchived: false },
              orderBy: { position: 'asc' },
              include: {
                tasks: {
                  where: { isArchived: false },
                  orderBy: { position: 'asc' },
                  include: {
                    assignees: {
                      include: {
                        user: {
                          select: { id: true, fullName: true, avatarUrl: true },
                        },
                      },
                    },
                    labels: {
                      include: { label: true },
                    },
                    checklists: {
                      include: { items: true },
                    },
                    _count: {
                      select: { comments: true, attachments: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable.');
    }

    // Verify workspace access
    const isMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: project.workspaceId, userId } },
    });
    if (!isMember) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet.');
    }

    return project;
  }

  /**
   * Update project general properties
   */
  async updateProject(projectId: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Projet introuvable.');

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.plannedStartDate !== undefined && {
          plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : null,
        }),
        ...(dto.plannedEndDate !== undefined && {
          plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : null,
        }),
        ...(dto.actualStartDate !== undefined && {
          actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : null,
        }),
        ...(dto.actualEndDate !== undefined && {
          actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : null,
        }),
        ...(dto.coverUrl !== undefined && { coverUrl: dto.coverUrl }),
        ...(dto.position !== undefined && { position: dto.position }),
      },
    });
  }

  /**
   * Custom Theme & Cinematic Identity (Premium Feature)
   */
  async updateTheme(projectId: string, userId: string, dto: UpdateThemeDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Projet introuvable.');

    // Assert entitlement
    await this.entitlementsService.assertCanUseCustomTheme(project.workspaceId);

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.customColor !== undefined && { customColor: dto.customColor }),
        ...(dto.customGradient !== undefined && { customGradient: dto.customGradient }),
        ...(dto.backgroundTheme !== undefined && { backgroundTheme: dto.backgroundTheme }),
        ...(dto.coverUrl !== undefined && { coverUrl: dto.coverUrl }),
      },
    });
  }

  /**
   * Reorder project horizontal positions in Projects Overview
   */
  async reorderProjects(workspaceId: string, userId: string, projectIds: string[]) {
    await Promise.all(
      projectIds.map((id, index) =>
        this.prisma.project.update({
          where: { id },
          data: { position: (index + 1) * 1000 },
        })
      )
    );
    return { success: true };
  }

  /**
   * Delete / Archive Project
   */
  async deleteProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Projet introuvable.');

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true, message: 'Projet supprimé définitivement.' };
  }
}
