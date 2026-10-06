import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListDto {
  @ApiProperty({ example: 'En attente de validation' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la colonne est requis' })
  name: string;

  @ApiPropertyOptional({ example: '#38BDF8' })
  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  color?: string;
}

export class ReorderListsDto {
  @ApiProperty({ type: [String], description: 'Identifiants des colonnes dans le nouvel ordre' })
  @IsArray()
  listIds: string[];
}
