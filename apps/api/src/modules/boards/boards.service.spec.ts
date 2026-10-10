import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BoardsService', () => {
  let service: BoardsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      board: {
        findUnique: jest.fn(),
      },
      list: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBoardById', () => {
    it('should throw NotFoundException when board does not exist', async () => {
      prisma.board.findUnique.mockResolvedValue(null);

      await expect(service.getBoardById('invalid-board')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return board with active lists and tasks', async () => {
      const mockBoard = {
        id: 'board-1',
        projectId: 'project-1',
        title: 'Tableau Principal',
        lists: [
          {
            id: 'list-1',
            name: 'À faire',
            position: 1000,
            tasks: [],
          },
        ],
      };
      prisma.board.findUnique.mockResolvedValue(mockBoard);

      const result = await service.getBoardById('board-1');
      expect(result.id).toBe('board-1');
      expect(result.lists).toHaveLength(1);
    });
  });

  describe('createList', () => {
    it('should compute incremental position and create list', async () => {
      prisma.list.findFirst.mockResolvedValue({ position: 2000 });
      prisma.list.create.mockResolvedValue({
        id: 'list-new',
        boardId: 'board-1',
        name: 'En cours',
        position: 3000,
      });

      const result = await service.createList('board-1', {
        name: 'En cours',
      });

      expect(result.id).toBe('list-new');
      expect(prisma.list.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          boardId: 'board-1',
          name: 'En cours',
          position: 3000,
        }),
      });
    });
  });

  describe('deleteList', () => {
    it('should mark list as archived', async () => {
      prisma.list.findUnique.mockResolvedValue({ id: 'list-to-del' });
      prisma.list.update.mockResolvedValue({ id: 'list-to-del', isArchived: true });

      const result = await service.deleteList('list-to-del');
      expect(result.success).toBe(true);
      expect(prisma.list.update).toHaveBeenCalledWith({
        where: { id: 'list-to-del' },
        data: { isArchived: true },
      });
    });
  });
});
