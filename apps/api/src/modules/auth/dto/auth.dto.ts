import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'alban@expansion.io', description: 'Adresse email professionnelle' })
  @IsEmail({}, { message: 'Format d\'adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe sécurisé (min 8 caractères)' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit comporter au moins 8 caractères' })
  password: string;

  @ApiProperty({ example: 'Alban Expansion', description: 'Nom complet de l\'utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom complet est obligatoire' })
  fullName: string;

  @ApiPropertyOptional({ example: 'Mon Espace de Travail', description: 'Nom de l\'espace initial' })
  @IsString()
  @IsOptional()
  workspaceName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'alban@expansion.io' })
  @IsEmail({}, { message: 'Format d\'adresse email invalide' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Jeton de rafraîchissement JWT' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mot de passe actuel' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: 'Nouveau mot de passe (min 8 car.)' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'alban@expansion.io' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
