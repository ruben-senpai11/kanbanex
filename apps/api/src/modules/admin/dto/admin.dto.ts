import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SystemRole } from '@prisma/client';

export class UpdatePlanDto {
  @ApiPropertyOptional({ example: 'Eclosion Pro' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Description mise à jour...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 6500, description: 'Nouveau prix en FCFA' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  maxProjects?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  maxMembersPerProject?: number;

  @ApiPropertyOptional()
  @IsOptional()
  features?: Record<string, boolean>;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: SystemRole })
  @IsEnum(SystemRole)
  role: SystemRole;
}

export class UpdateSystemSettingDto {
  @ApiProperty({ example: 'FEDAPAY_ENABLED' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: { enabled: true, environment: 'live' } })
  value: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
