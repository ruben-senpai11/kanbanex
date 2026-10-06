import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Activity & Audit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Obtenir l\'historique d\'activité récent d\'un projet' })
  @ApiQuery({ name: 'limit', required: false })
  async getProjectActivity(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: number,
  ) {
    return this.activityService.getProjectActivity(projectId, limit ? Number(limit) : 20);
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Obtenir le journal d\'audit global de l\'espace' })
  @ApiQuery({ name: 'limit', required: false })
  async getWorkspaceActivity(
    @Param('workspaceId') workspaceId: string,
    @Query('limit') limit?: number,
  ) {
    return this.activityService.getWorkspaceActivity(workspaceId, limit ? Number(limit) : 30);
  }
}
