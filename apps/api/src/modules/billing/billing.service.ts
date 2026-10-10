import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutDto } from './dto/billing.dto';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private get fedapaySecretKey(): string {
    return this.configService.get<string>('FEDAPAY_SECRET_KEY') || '';
  }

  private get fedapayEnv(): string {
    return this.configService.get<string>('FEDAPAY_ENVIRONMENT') || 'sandbox';
  }

  /**
   * Get all available subscription plans with pricing from DB (never hardcoded)
   */
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  /**
   * Get workspace current subscription status, plan entitlements and quota usage
   */
  async getWorkspaceSubscription(workspaceId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { workspaceId },
      include: { plan: true },
    });

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    let isSuperAdmin = false;
    if (workspace?.ownerId) {
      const owner = await this.prisma.user.findUnique({
        where: { id: workspace.ownerId },
      });
      isSuperAdmin = owner?.role === 'SUPER_ADMIN';
    }

    if (isSuperAdmin) {
      const enterprisePlan = await this.prisma.subscriptionPlan.findFirst({
        where: { slug: { in: ['entreprise', 'enterprise'] } },
      });
      if (enterprisePlan && (!subscription || subscription.planId !== enterprisePlan.id)) {
        subscription = await this.prisma.subscription.upsert({
          where: { workspaceId },
          create: {
            workspaceId,
            planId: enterprisePlan.id,
            status: SubscriptionStatus.ACTIVE,
          },
          update: {
            planId: enterprisePlan.id,
            status: SubscriptionStatus.ACTIVE,
          },
          include: { plan: true },
        });
      }
    } else if (!subscription) {
      const defaultPlan = await this.prisma.subscriptionPlan.findFirst({
        where: { slug: { in: ['starter', 'basic'] } },
      });
      if (defaultPlan) {
        subscription = await this.prisma.subscription.create({
          data: {
            workspaceId,
            planId: defaultPlan.id,
            status: SubscriptionStatus.ACTIVE,
          },
          include: { plan: true },
        });
      }
    }

    // Usage calculation
    const currentProjectsCount = await this.prisma.project.count({
      where: { workspaceId, isArchived: false },
    });
    const currentMembersCount = await this.prisma.workspaceMember.count({
      where: { workspaceId },
    });

    // Recent transactions
    const transactions = await this.prisma.paymentTransaction.findMany({
      where: { workspaceId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });

    return {
      subscription,
      usage: {
        projectsCount: currentProjectsCount,
        maxProjects: subscription?.plan.maxProjects ?? 3,
        membersCount: currentMembersCount,
        maxMembers: subscription?.plan.maxMembersPerProject ?? 2,
      },
      transactions,
    };
  }

  /**
   * Initiate FedaPay checkout for subscription upgrade
   */
  async createCheckout(workspaceId: string, userId: string, dto: CreateCheckoutDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const targetPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { slug: dto.planSlug },
    });
    if (!targetPlan) throw new NotFoundException('Plan d\'abonnement introuvable.');

    if (targetPlan.price === 0) {
      // Downgrade or switch to free Basic plan directly
      await this.prisma.subscription.upsert({
        where: { workspaceId },
        update: {
          planId: targetPlan.id,
          status: SubscriptionStatus.ACTIVE,
        },
        create: {
          workspaceId,
          planId: targetPlan.id,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      return {
        isFree: true,
        message: 'Passage au plan Basic effectué avec succès.',
      };
    }

    // 1. Create PENDING PaymentTransaction record
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        workspaceId,
        planId: targetPlan.id,
        provider: 'FEDAPAY',
        amount: targetPlan.price,
        currency: targetPlan.currency,
        status: PaymentStatus.PENDING,
        metadata: {
          planSlug: targetPlan.slug,
          userEmail: user.email,
          userName: user.fullName,
        },
      },
    });

    // 2. Real FedaPay API integration
    const isLive = this.fedapayEnv === 'live';
    const fedapayApiUrl = isLive
      ? 'https://api.fedapay.com/v1/transactions'
      : 'https://sandbox-api.fedapay.com/v1/transactions';

    let checkoutUrl = '';
    let providerTxId = `TX_FEDAPAY_${transaction.id.slice(0, 8)}`;

    if (this.fedapaySecretKey && this.fedapaySecretKey.startsWith('sk_')) {
      try {
        const baseCallback =
          dto.callbackUrl ||
          `${this.configService.get('APP_URL') || this.configService.get('FRONTEND_URL') || 'https://kanbanex.vercel.app'}/billing`;
        const separator = baseCallback.includes('?') ? '&' : '?';
        const callbackUrl = `${baseCallback}${separator}tx=${transaction.id}`;

        const response = await fetch(fedapayApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.fedapaySecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: `Abonnement KanbanEX ${targetPlan.name}`,
            amount: targetPlan.price,
            currency: { iso: targetPlan.currency },
            callback_url: callbackUrl,
            customer: {
              email: user.email,
              firstname: user.fullName.split(' ')[0] || 'Client',
              lastname: user.fullName.split(' ')[1] || 'Expansion',
            },
          }),
        });

        const data: any = await response.json();
        if (data && data['v1/transaction']) {
          providerTxId = String(data['v1/transaction'].id);
          // FedaPay checkout token generation
          const tokenRes = await fetch(`${fedapayApiUrl}/${providerTxId}/token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.fedapaySecretKey}`,
              'Content-Type': 'application/json',
            },
          });
          const tokenData: any = await tokenRes.json();
          checkoutUrl = tokenData.url || tokenData.token;
        }
      } catch (err) {
        this.logger.error(`Erreur communication API FedaPay: ${err.message}`);
      }
    }

    // Update transaction with providerTxId
    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { providerTxId },
    });

    return {
      isFree: false,
      transactionId: transaction.id,
      providerTxId,
      checkoutUrl: checkoutUrl || `/billing/checkout?tx=${transaction.id}`,
      amount: targetPlan.price,
      currency: targetPlan.currency,
      planName: targetPlan.name,
      planSlug: targetPlan.slug,
    };
  }

  /**
   * Verify and finalize transaction (source of truth is the server)
   */
  async verifyPayment(transactionId: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: { plan: true },
    });

    if (!transaction) throw new NotFoundException('Transaction introuvable.');

    if (transaction.status === PaymentStatus.APPROVED) {
      return { success: true, message: 'Transaction déjà validée.', transaction };
    }

    // 1. Si la clé secrète FedaPay est configurée, vérifier en temps réel auprès de l'API FedaPay (Single Source of Truth)
    if (this.fedapaySecretKey && transaction.providerTxId && !transaction.providerTxId.startsWith('TX_FEDAPAY_')) {
      const isLive = this.fedapayEnv === 'live';
      const fedapayApiUrl = isLive
        ? `https://api.fedapay.com/v1/transactions/${transaction.providerTxId}`
        : `https://sandbox-api.fedapay.com/v1/transactions/${transaction.providerTxId}`;

      try {
        const response = await fetch(fedapayApiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.fedapaySecretKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new BadRequestException('Impossible de joindre la passerelle FedaPay pour vérifier la transaction.');
        }

        const data: any = await response.json();
        const fedaTx = data['v1/transaction'] || data.transaction || data;
        const status = fedaTx?.status;

        // FedaPay status doit impérativement être 'approved' pour valider
        if (status !== 'approved') {
          throw new BadRequestException(
            `Le paiement n'a pas été validé par la passerelle de paiement (statut actuel : ${status || 'en attente'}). Les fonds n'ont pas été reçus.`,
          );
        }
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        throw new BadRequestException(`Erreur lors de la confirmation du paiement : ${err.message}`);
      }
    } else if (this.fedapaySecretKey && transaction.providerTxId?.startsWith('TX_FEDAPAY_')) {
      throw new BadRequestException('Transaction non initiée auprès de la passerelle.');
    } else {
      this.logger.warn(`[SIMULATION DEV] Validation de la transaction ${transactionId} sans clé FedaPay.`);
    }

    // Set end period to 30 days from now
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    // Update transaction to APPROVED
    const updatedTx = await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.APPROVED,
        completedAt: new Date(),
      },
    });

    // Update Workspace subscription
    await this.prisma.subscription.upsert({
      where: { workspaceId: transaction.workspaceId },
      update: {
        planId: transaction.planId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
      create: {
        workspaceId: transaction.workspaceId,
        planId: transaction.planId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
    });

    this.logger.log(`Abonnement validé pour l'espace ${transaction.workspaceId} vers le plan ${transaction.plan.name}`);

    return {
      success: true,
      message: `Abonnement ${transaction.plan.name} activé avec succès.`,
      transaction: updatedTx,
    };
  }

  /**
   * Webhook handler for FedaPay callbacks (Idempotent)
   */
  async handleWebhook(event: string, payload: any) {
    this.logger.log(`Webhook FedaPay reçu : ${event || payload?.name}`);

    const fedaId = String(payload?.entity?.id || payload?.id || payload?.['v1/transaction']?.id || '');
    if (!fedaId) {
      return { received: false, message: 'ID de transaction introuvable' };
    }

    const tx = await this.prisma.paymentTransaction.findFirst({
      where: { providerTxId: fedaId },
    });

    if (tx && tx.status !== PaymentStatus.APPROVED) {
      await this.verifyPayment(tx.id);
    }

    return { received: true };
  }
}
