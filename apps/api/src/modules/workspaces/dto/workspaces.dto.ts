import { IsNotEmpty, IsOptional, IsString, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkspaceRole } from '@prisma/client';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'Expansion Labs', description: 'Nom de l\'espace de travail' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de l\'espace de travail est requis' })
  name: string;

  @ApiPropertyOptional({ example: 'Espace d\'ingénierie et de conception produit' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({ example: 'Expansion Studio' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'collab@expansion.io' })
  @IsEmail({}, { message: 'Adresse email valide requise' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: WorkspaceRole, default: WorkspaceRole.MEMBER })
  @IsEnum(WorkspaceRole)
  role: WorkspaceRole;
}
