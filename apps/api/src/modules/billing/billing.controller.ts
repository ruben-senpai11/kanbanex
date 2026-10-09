import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateCheckoutDto, VerifyPaymentDto } from './dto/billing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Billing & Plans')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Lister les plans d\'abonnement disponibles avec prix réels depuis la base de données' })
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Get('workspace/:workspaceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir l\'abonnement et les quotas de l\'espace de travail' })
  async getWorkspaceSubscription(@Param('workspaceId') workspaceId: string) {
    return this.billingService.getWorkspaceSubscription(workspaceId);
  }

  @Post('checkout/workspace/:workspaceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initier un paiement sécurisé pour changer d\'abonnement' })
  async createCheckout(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.billingService.createCheckout(workspaceId, userId, dto);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier et activer le paiement côté serveur (Source de vérité)' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.billingService.verifyPayment(dto.transactionId);
  }

  @Post('webhook/fedapay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook sécurisé et idempotent de paiement' })
  async handleWebhook(
    @Headers('x-fedapay-event') event: string,
    @Body() payload: any,
  ) {
    return this.billingService.handleWebhook(event, payload);
  }
}
