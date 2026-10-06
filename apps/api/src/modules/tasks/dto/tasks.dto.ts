import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, Priority, DependencyType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implémenter le visualiseur panoramique' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre de la tâche est obligatoire' })
  title: string;

  @ApiPropertyOptional({ example: 'Détails de l\'implémentation...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-10-10T09:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-10-18T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiPropertyOptional({ example: 8.5 })
  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  assigneeIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  labelIds?: string[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dueTime?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  actualHours?: number;

  @ApiPropertyOptional({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercentage?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class MoveTaskDto {
  @ApiProperty({ description: 'ID de la colonne de destination' })
  @IsString()
  @IsNotEmpty()
  targetListId: string;

  @ApiProperty({ description: 'Position ordonnée dans la colonne' })
  @IsNumber()
  targetPosition: number;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  targetStatus?: TaskStatus;
}

export class CreateChecklistDto {
  @ApiProperty({ example: 'Critères d\'acceptation' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateChecklistItemDto {
  @ApiProperty({ example: 'Rédiger les tests unitaires' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateChecklistItemDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class SetDependencyDto {
  @ApiProperty({ description: 'ID de la tâche prédécesseur' })
  @IsString()
  @IsNotEmpty()
  predecessorTaskId: string;

  @ApiPropertyOptional({ enum: DependencyType, default: DependencyType.FINISH_TO_START })
  @IsEnum(DependencyType)
  @IsOptional()
  dependencyType?: DependencyType;
}
