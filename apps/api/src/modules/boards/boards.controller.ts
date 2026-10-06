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
import { BoardsService } from './boards.service';
import { CreateListDto, UpdateListDto, ReorderListsDto } from './dto/boards.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Boards & Lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un tableau avec ses colonnes et cartes' })
  async getBoardById(@Param('id') boardId: string) {
    return this.boardsService.getBoardById(boardId);
  }

  @Post(':id/lists')
  @ApiOperation({ summary: 'Ajouter une colonne dans le tableau' })
  async createList(
    @Param('id') boardId: string,
    @Body() dto: CreateListDto,
  ) {
    return this.boardsService.createList(boardId, dto);
  }

  @Patch('lists/:listId')
  @ApiOperation({ summary: 'Modifier une colonne' })
  async updateList(
    @Param('listId') listId: string,
    @Body() dto: UpdateListDto,
  ) {
    return this.boardsService.updateList(listId, dto);
  }

  @Post(':id/lists/reorder')
  @ApiOperation({ summary: 'Réordonner les colonnes du tableau' })
  async reorderLists(
    @Param('id') boardId: string,
    @Body() dto: ReorderListsDto,
  ) {
    return this.boardsService.reorderLists(boardId, dto);
  }

  @Delete('lists/:listId')
  @ApiOperation({ summary: 'Archiver une colonne' })
  async deleteList(@Param('listId') listId: string) {
    return this.boardsService.deleteList(listId);
  }
}
