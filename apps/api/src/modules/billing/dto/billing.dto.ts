import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty({ example: 'eclosion', description: 'Slug du plan (basic, eclosion, entreprise)' })
  @IsString()
  @IsNotEmpty({ message: 'Le slug du plan est obligatoire' })
  planSlug: string;

  @ApiPropertyOptional({ example: 'http://localhost:3000/billing/success' })
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ description: 'ID de la transaction KanbanEX' })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
