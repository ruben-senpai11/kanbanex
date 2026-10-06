import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GanttService } from './gantt.service';
import { UpdateGanttDatesDto } from './dto/gantt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gantt')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('gantt')
export class GanttController {
  constructor(private readonly ganttService: GanttService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Obtenir la timeline Gantt complète d\'un projet avec dépendances' })
  async getGanttData(@Param('projectId') projectId: string) {
    return this.ganttService.getGanttData(projectId);
  }

  @Patch('tasks/:taskId/dates')
  @ApiOperation({ summary: 'Modifier les dates et la progression d\'une tâche depuis la timeline Gantt (Drag/Resize)' })
  async updateTaskDates(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateGanttDatesDto,
  ) {
    return this.ganttService.updateTaskDates(taskId, dto);
  }
}
