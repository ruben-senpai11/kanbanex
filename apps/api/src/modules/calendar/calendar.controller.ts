import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Calendar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Obtenir les tâches du projet pour le calendrier' })
  @ApiQuery({ name: 'start', required: false, description: 'Date de début ISO' })
  @ApiQuery({ name: 'end', required: false, description: 'Date de fin ISO' })
  async getCalendarTasks(
    @Param('projectId') projectId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.calendarService.getCalendarTasks(projectId, start, end);
  }
}
