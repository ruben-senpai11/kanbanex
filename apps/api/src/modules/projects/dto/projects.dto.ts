import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus, Priority } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'Refonte Plateforme Expansion' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du projet est requis' })
  name: string;

  @ApiPropertyOptional({ example: 'Déploiement du nouveau système de design et architecture SaaS' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-10-15T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  plannedStartDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  plannedEndDate?: string;

  @ApiPropertyOptional({ example: '#F97316' })
  @IsString()
  @IsOptional()
  customColor?: string;

  @ApiPropertyOptional({ example: 'from-amber-500 to-orange-600' })
  @IsString()
  @IsOptional()
  customGradient?: string;

  @ApiPropertyOptional({ example: 'vast-skies' })
  @IsString()
  @IsOptional()
  backgroundTheme?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: Priority })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  plannedStartDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  plannedEndDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  actualStartDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  actualEndDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverUrl?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class UpdateThemeDto {
  @ApiPropertyOptional({ example: '#F97316' })
  @IsString()
  @IsOptional()
  customColor?: string;

  @ApiPropertyOptional({ example: 'from-amber-500 to-orange-600' })
  @IsString()
  @IsOptional()
  customGradient?: string;

  @ApiPropertyOptional({ example: 'vast-skies' })
  @IsString()
  @IsOptional()
  backgroundTheme?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsOptional()
  coverUrl?: string;
}
