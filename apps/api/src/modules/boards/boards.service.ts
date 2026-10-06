import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto, UpdateListDto, ReorderListsDto } from './dto/boards.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBoardById(boardId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          where: { isArchived: false },
          orderBy: { position: 'asc' },
          include: {
            tasks: {
              where: { isArchived: false },
              orderBy: { position: 'asc' },
              include: {
                assignees: {
                  include: {
                    user: {
                      select: { id: true, fullName: true, avatarUrl: true },
                    },
                  },
                },
                labels: {
                  include: { label: true },
                },
                checklists: {
                  include: { items: true },
                },
                _count: {
                  select: { comments: true, attachments: true },
                },
              },
            },
          },
        },
      },
    });

    if (!board) throw new NotFoundException('Tableau introuvable.');
    return board;
  }

  async createList(boardId: string, dto: CreateListDto) {
    const lastList = await this.prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (lastList?.position ?? 0) + 1000;

    return this.prisma.list.create({
      data: {
        boardId,
        name: dto.name.trim(),
        color: dto.color,
        position,
      },
    });
  }

  async updateList(listId: string, dto: UpdateListDto) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Colonne introuvable.');

    return this.prisma.list.update({
      where: { id: listId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.color !== undefined && { color: dto.color }),
      },
    });
  }

  async reorderLists(boardId: string, dto: ReorderListsDto) {
    await Promise.all(
      dto.listIds.map((id, index) =>
        this.prisma.list.update({
          where: { id },
          data: { position: (index + 1) * 1000 },
        })
      )
    );
    return { success: true };
  }

  async deleteList(listId: string) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Colonne introuvable.');

    await this.prisma.list.update({
      where: { id: listId },
      data: { isArchived: true },
    });

    return { success: true, message: 'Colonne archivée avec succès.' };
  }
}
