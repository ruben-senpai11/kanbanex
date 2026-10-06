import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LabelsService } from './labels.service';
import { CreateLabelDto, AttachLabelDto } from './dto/labels.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Labels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Lister les étiquettes de l\'espace' })
  async getWorkspaceLabels(@Param('workspaceId') workspaceId: string) {
    return this.labelsService.getWorkspaceLabels(workspaceId);
  }

  @Post('workspace/:workspaceId')
  @ApiOperation({ summary: 'Créer une étiquette colorée' })
  async createLabel(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateLabelDto,
  ) {
    return this.labelsService.createLabel(workspaceId, dto);
  }

  @Post('task/:taskId')
  @ApiOperation({ summary: 'Attacher une étiquette à une tâche' })
  async attachToTask(
    @Param('taskId') taskId: string,
    @Body() dto: AttachLabelDto,
  ) {
    return this.labelsService.attachToTask(taskId, dto.labelId);
  }

  @Delete('task/:taskId/:labelId')
  @ApiOperation({ summary: 'Détacher une étiquette d\'une tâche' })
  async detachFromTask(
    @Param('taskId') taskId: string,
    @Param('labelId') labelId: string,
  ) {
    return this.labelsService.detachFromTask(taskId, labelId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une étiquette' })
  async deleteLabel(@Param('id') labelId: string) {
    return this.labelsService.deleteLabel(labelId);
  }
}
