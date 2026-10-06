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
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  CreateChecklistDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
  SetDependencyDto,
} from './dto/tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails complets d\'une tâche pour le drawer latéral' })
  async getTaskDetails(@Param('id') taskId: string) {
    return this.tasksService.getTaskDetails(taskId);
  }

  @Post('list/:listId')
  @ApiOperation({ summary: 'Créer une tâche dans une colonne' })
  async createTask(
    @Param('listId') listId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(listId, userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour les propriétés d\'une tâche' })
  async updateTask(
    @Param('id') taskId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, userId, dto);
  }

  @Post(':id/move')
  @ApiOperation({ summary: 'Déplacer une tâche entre colonnes ou réordonner (Drag & Drop)' })
  async moveTask(
    @Param('id') taskId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasksService.moveTask(taskId, userId, dto);
  }

  @Post(':id/assignees/:userId')
  @ApiOperation({ summary: 'Assigner un collaborateur à la tâche' })
  async assignUser(
    @Param('id') taskId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.tasksService.assignUser(taskId, targetUserId);
  }

  @Delete(':id/assignees/:userId')
  @ApiOperation({ summary: 'Désassigner un collaborateur' })
  async unassignUser(
    @Param('id') taskId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.tasksService.unassignUser(taskId, targetUserId);
  }

  @Post(':id/checklists')
  @ApiOperation({ summary: 'Ajouter une checklist à la tâche' })
  async addChecklist(
    @Param('id') taskId: string,
    @Body() dto: CreateChecklistDto,
  ) {
    return this.tasksService.addChecklist(taskId, dto);
  }

  @Post('checklists/:checklistId/items')
  @ApiOperation({ summary: 'Ajouter un élément dans une checklist' })
  async addChecklistItem(
    @Param('checklistId') checklistId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.tasksService.addChecklistItem(checklistId, dto);
  }

  @Patch('checklists/items/:itemId')
  @ApiOperation({ summary: 'Cocher / décocher ou renommer un élément de checklist' })
  async toggleChecklistItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.tasksService.toggleChecklistItem(itemId, dto);
  }

  @Delete('checklists/:checklistId')
  @ApiOperation({ summary: 'Supprimer une checklist' })
  async deleteChecklist(@Param('checklistId') checklistId: string) {
    return this.tasksService.deleteChecklist(checklistId);
  }

  @Post(':id/dependencies')
  @ApiOperation({ summary: 'Ajouter un lien de dépendance entre tâches (pour Gantt)' })
  async setDependency(
    @Param('id') successorTaskId: string,
    @Body() dto: SetDependencyDto,
  ) {
    return this.tasksService.setDependency(successorTaskId, dto);
  }

  @Delete(':successorId/dependencies/:predecessorId')
  @ApiOperation({ summary: 'Supprimer un lien de dépendance' })
  async removeDependency(
    @Param('predecessorId') predecessorTaskId: string,
    @Param('successorId') successorTaskId: string,
  ) {
    return this.tasksService.removeDependency(predecessorTaskId, successorTaskId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une tâche' })
  async deleteTask(
    @Param('id') taskId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.tasksService.deleteTask(taskId, userId);
  }
}
