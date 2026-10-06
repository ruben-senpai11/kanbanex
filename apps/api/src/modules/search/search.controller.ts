import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Search & Filters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Recherche globale et filtres dynamiques multicritères' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiQuery({ name: 'labelId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'isOverdue', required: false })
  async search(
    @Param('workspaceId') workspaceId: string,
    @Query('q') q?: string,
    @Query('projectId') projectId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('labelId') labelId?: string,
    @Query('status') status?: any,
    @Query('priority') priority?: any,
    @Query('isOverdue') isOverdue?: string,
  ) {
    return this.searchService.globalSearch(workspaceId, {
      query: q,
      projectId,
      assigneeId,
      labelId,
      status,
      priority,
      isOverdue: isOverdue === 'true',
    });
  }
}
