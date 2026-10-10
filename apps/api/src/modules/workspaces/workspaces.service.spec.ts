import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesService } from './workspaces.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      workspaceMember: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      workspace: {
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      subscriptionPlan: {
        findFirst: jest.fn(),
      },
      subscription: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserWorkspaces', () => {
    it('should return workspaces formatted with user role and joinedAt', async () => {
      const mockMembers = [
        {
          role: WorkspaceRole.OWNER,
          joinedAt: new Date(),
          workspace: {
            id: 'ws-1',
            name: 'Mon Workspace',
            subscription: null,
            _count: { projects: 2, members: 1 },
          },
        },
      ];
      prisma.workspaceMember.findMany.mockResolvedValue(mockMembers);

      const result = await service.getUserWorkspaces('u-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('ws-1');
      expect(result[0].role).toBe(WorkspaceRole.OWNER);
    });
  });

  describe('getWorkspaceById', () => {
    it('should throw ForbiddenException if user is not a member of workspace', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.getWorkspaceById('ws-999', 'u-unknown')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return workspace details and currentUserRole when membership exists', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue({
        role: WorkspaceRole.ADMIN,
        workspace: {
          id: 'ws-10',
          name: 'Workspace Alpha',
          members: [],
        },
      });

      const result = await service.getWorkspaceById('ws-10', 'u-1');
      expect(result.id).toBe('ws-10');
      expect(result.currentUserRole).toBe(WorkspaceRole.ADMIN);
    });
  });

  describe('createWorkspace', () => {
    it('should create workspace, attach owner member and link default subscription plan', async () => {
      prisma.workspace.create.mockResolvedValue({
        id: 'ws-new',
        name: 'Startup Pro',
        slug: 'startup-pro-12345',
      });
      prisma.user.findUnique.mockResolvedValue({ id: 'u-1', role: 'USER' });
      prisma.subscriptionPlan.findFirst.mockResolvedValue({
        id: 'plan-vis',
        slug: 'visionnaire',
      });
      prisma.subscription.create.mockResolvedValue({ id: 'sub-new' });

      const result = await service.createWorkspace('u-1', {
        name: 'Startup Pro',
        description: 'Espace de développement',
      });

      expect(result.id).toBe('ws-new');
      expect(prisma.workspace.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Startup Pro',
            ownerId: 'u-1',
          }),
        }),
      );
      expect(prisma.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            workspaceId: 'ws-new',
            planId: 'plan-vis',
          }),
        }),
      );
    });
  });

  describe('inviteMember', () => {
    it('should throw ForbiddenException if actor is just a regular MEMBER', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue({
        role: WorkspaceRole.MEMBER,
      });

      await expect(
        service.inviteMember('ws-1', 'actor-1', {
          email: 'invitee@example.com',
          role: WorkspaceRole.MEMBER,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if invited user does not exist', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue({
        role: WorkspaceRole.OWNER,
      });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.inviteMember('ws-1', 'actor-1', {
          email: 'notfound@example.com',
          role: WorkspaceRole.MEMBER,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if invited user is already a member', async () => {
      prisma.workspaceMember.findUnique
        .mockResolvedValueOnce({ role: WorkspaceRole.OWNER }) // actor check
        .mockResolvedValueOnce({ id: 'existing-member' }); // existing check
      prisma.user.findUnique.mockResolvedValue({ id: 'target-u', email: 'already@example.com' });

      await expect(
        service.inviteMember('ws-1', 'actor-1', {
          email: 'already@example.com',
          role: WorkspaceRole.MEMBER,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should add member when valid', async () => {
      prisma.workspaceMember.findUnique
        .mockResolvedValueOnce({ role: WorkspaceRole.OWNER }) // actor check
        .mockResolvedValueOnce(null); // existing check
      prisma.user.findUnique.mockResolvedValue({ id: 'target-u', email: 'newmember@example.com' });
      prisma.workspaceMember.create.mockResolvedValue({
        id: 'member-new',
        workspaceId: 'ws-1',
        userId: 'target-u',
        role: WorkspaceRole.MEMBER,
      });

      const result = await service.inviteMember('ws-1', 'actor-1', {
        email: 'newmember@example.com',
        role: WorkspaceRole.MEMBER,
      });
      expect(result.id).toBe('member-new');
    });
  });
});
