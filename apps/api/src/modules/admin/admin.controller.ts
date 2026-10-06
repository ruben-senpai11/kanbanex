import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdatePlanDto, UpdateUserRoleDto, UpdateSystemSettingDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemRole } from '@prisma/client';

@ApiTags('Admin (Super Admin)')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(SystemRole.SUPER_ADMIN)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques globales de la plateforme' })
  async getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Lister et rechercher les utilisateurs' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsersList(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
    );
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Modifier le rôle système d\'un utilisateur' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(userId, dto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Lister tous les plans d\'abonnement pour configuration' })
  async getAllPlans() {
    return this.adminService.getAllPlans();
  }

  @Patch('plans/:id')
  @ApiOperation({ summary: 'Mettre à jour le prix, quotas et fonctionnalités d\'un plan (modifie les prix dynamiquement)' })
  async updatePlan(
    @Param('id') planId: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.adminService.updatePlan(planId, dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Consulter l\'historique global des transactions de facturation' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getTransactions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllTransactions(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('settings')
  @ApiOperation({ summary: 'Obtenir les paramètres système configurables' })
  async getSystemSettings() {
    return this.adminService.getSystemSettings();
  }

  @Post('settings')
  @ApiOperation({ summary: 'Créer ou mettre à jour un paramètre système' })
  async updateSystemSetting(@Body() dto: UpdateSystemSettingDto) {
    return this.adminService.updateSystemSetting(dto);
  }
}
