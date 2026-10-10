import { Test, TestingModule } from '@nestjs/testing';
import { EntitlementsService } from './entitlements.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('EntitlementsService', () => {
  let service: EntitlementsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      subscription: {
        findUnique: jest.fn(),
      },
      subscriptionPlan: {
        findUnique: jest.fn(),
      },
      project: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntitlementsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EntitlementsService>(EntitlementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWorkspaceEntitlements', () => {
    it('should fallback to default basic plan if no subscription found', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);
      prisma.subscriptionPlan.findUnique.mockResolvedValue({
        slug: 'basic',
        name: 'Visionnaire',
        maxProjects: 3,
        maxMembersPerProject: 2,
        features: { customThemes: false },
      });

      const entitlements = await service.getWorkspaceEntitlements('ws-1');
      expect(entitlements.planSlug).toBe('basic');
      expect(entitlements.maxProjects).toBe(3);
      expect(entitlements.features).toEqual({ customThemes: false });
    });

    it('should return subscription plan quotas and features when subscription exists', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'eclosion',
          name: 'Éclosion',
          maxProjects: 15,
          maxMembersPerProject: 5,
          features: { customThemes: true, ganttExport: true },
        },
      });

      const entitlements = await service.getWorkspaceEntitlements('ws-1');
      expect(entitlements.planSlug).toBe('eclosion');
      expect(entitlements.maxProjects).toBe(15);
      expect(entitlements.features.customThemes).toBe(true);
    });
  });

  describe('assertCanCreateProject', () => {
    it('should allow project creation if limit is not exceeded', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'visionnaire',
          name: 'Visionnaire',
          maxProjects: 3,
          maxMembersPerProject: 2,
          features: {},
        },
      });
      prisma.project.count.mockResolvedValue(2); // 2 < 3

      await expect(service.assertCanCreateProject('ws-1')).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if project limit is reached', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'visionnaire',
          name: 'Visionnaire',
          maxProjects: 3,
          maxMembersPerProject: 2,
          features: {},
        },
      });
      prisma.project.count.mockResolvedValue(3); // 3 >= 3

      await expect(service.assertCanCreateProject('ws-1')).rejects.toThrow(ForbiddenException);
    });

    it('should allow unlimited projects if maxProjects is -1', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'expansion',
          name: 'Expansion',
          maxProjects: -1,
          maxMembersPerProject: -1,
          features: {},
        },
      });

      await expect(service.assertCanCreateProject('ws-1')).resolves.not.toThrow();
      expect(prisma.project.count).not.toHaveBeenCalled();
    });
  });

  describe('assertCanUseCustomTheme', () => {
    it('should throw ForbiddenException if customThemes feature is false', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'visionnaire',
          name: 'Visionnaire',
          features: { customThemes: false },
        },
      });

      await expect(service.assertCanUseCustomTheme('ws-1')).rejects.toThrow(ForbiddenException);
    });

    it('should allow customThemes if customThemes feature is true', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        status: 'ACTIVE',
        plan: {
          slug: 'eclosion',
          name: 'Éclosion',
          features: { customThemes: true },
        },
      });

      await expect(service.assertCanUseCustomTheme('ws-1')).resolves.not.toThrow();
    });
  });
});
