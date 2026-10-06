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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, UpdateThemeDto } from './dto/projects.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('overview/workspace/:workspaceId')
  @ApiOperation({ summary: 'Signature : Récupérer tous les projets de l\'espace pour le Projects Overview panoramique' })
  async getProjectsOverview(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.getProjectsOverview(workspaceId, userId);
  }

  @Post('workspace/:workspaceId')
  @ApiOperation({ summary: 'Créer un nouveau projet avec initialisation automatique du tableau principal et des colonnes' })
  async createProject(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(workspaceId, userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails complets d\'un projet, colonnes et cartes' })
  async getProjectDetails(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.getProjectDetails(projectId, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour les informations du projet' })
  async updateProject(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(projectId, userId, dto);
  }

  @Patch(':id/theme')
  @ApiOperation({ summary: 'Personnaliser le thème visuel, les couleurs et les fonds cinématographiques (Premium)' })
  async updateTheme(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateThemeDto,
  ) {
    return this.projectsService.updateTheme(projectId, userId, dto);
  }

  @Post('reorder/workspace/:workspaceId')
  @ApiOperation({ summary: 'Réordonner l\'ordre horizontal des projets dans Projects Overview' })
  async reorderProjects(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('id') userId: string,
    @Body('projectIds') projectIds: string[],
  ) {
    return this.projectsService.reorderProjects(workspaceId, userId, projectIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer définitivement un projet' })
  async deleteProject(
    @Param('id') projectId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.projectsService.deleteProject(projectId, userId);
  }
}
