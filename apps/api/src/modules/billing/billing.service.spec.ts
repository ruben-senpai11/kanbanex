import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

describe('BillingService', () => {
  let service: BillingService;
  let prisma: any;
  let config: any;

  beforeEach(async () => {
    prisma = {
      subscriptionPlan: { findMany: jest.fn(), findUnique: jest.fn() },
      subscription: { findUnique: jest.fn(), create: jest.fn(), upsert: jest.fn() },
      paymentTransaction: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
      project: { count: jest.fn() },
      workspaceMember: { count: jest.fn() },
      user: { findUnique: jest.fn() },
    };

    config = {
      get: jest.fn((key: string) => {
        if (key === 'FEDAPAY_SECRET_KEY') return 'sk_sandbox_test';
        if (key === 'FEDAPAY_ENVIRONMENT') return 'sandbox';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should verify payment and update subscription status with server as source of truth', async () => {
    const mockTx = {
      id: 'tx-123',
      workspaceId: 'ws-456',
      planId: 'plan-eclosion',
      status: PaymentStatus.PENDING,
      plan: { name: 'Eclosion' },
    };

    prisma.paymentTransaction.findUnique.mockResolvedValue(mockTx);
    prisma.paymentTransaction.update.mockResolvedValue({
      ...mockTx,
      status: PaymentStatus.APPROVED,
    });
    prisma.subscription.upsert.mockResolvedValue({
      id: 'sub-789',
      workspaceId: 'ws-456',
      planId: 'plan-eclosion',
      status: SubscriptionStatus.ACTIVE,
    });

    const result = await service.verifyPayment('tx-123');
    expect(result.success).toBe(true);
    expect(prisma.paymentTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'tx-123' },
        data: expect.objectContaining({ status: PaymentStatus.APPROVED }),
      })
    );
    expect(prisma.subscription.upsert).toHaveBeenCalled();
  });
});
