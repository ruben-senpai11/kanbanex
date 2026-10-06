import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteMemberDto } from './dto/workspaces.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les espaces de travail de l\'utilisateur' })
  async getUserWorkspaces(@CurrentUser('id') userId: string) {
    return this.workspacesService.getUserWorkspaces(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel espace de travail' })
  async createWorkspace(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.createWorkspace(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un espace de travail' })
  async getWorkspaceById(
    @Param('id') workspaceId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.workspacesService.getWorkspaceById(workspaceId, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un espace de travail' })
  async updateWorkspace(
    @Param('id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.updateWorkspace(workspaceId, userId, dto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Inviter un membre dans l\'espace' })
  async inviteMember(
    @Param('id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: InviteMemberDto,
  ) {
    return this.workspacesService.inviteMember(workspaceId, userId, dto);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Retirer un membre de l\'espace' })
  async removeMember(
    @Param('id') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Param('memberId') targetUserId: string,
  ) {
    return this.workspacesService.removeMember(workspaceId, userId, targetUserId);
  }
}
