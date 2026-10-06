import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Obtenir les commentaires d\'une tâche' })
  async getComments(@Param('taskId') taskId: string) {
    return this.commentsService.getComments(taskId);
  }

  @Post('task/:taskId')
  @ApiOperation({ summary: 'Ajouter un commentaire sur une tâche' })
  async addComment(
    @Param('taskId') taskId: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.addComment(taskId, userId, content);
  }
}
