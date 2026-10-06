import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty({ example: 'Urgent Bug' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du label est requis' })
  name: string;

  @ApiProperty({ example: '#EF4444' })
  @IsString()
  @IsNotEmpty({ message: 'La couleur du label est requise' })
  color: string;

  @ApiPropertyOptional({ example: 'alert-triangle' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'Bloquant pour la production' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AttachLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  labelId: string;
}
