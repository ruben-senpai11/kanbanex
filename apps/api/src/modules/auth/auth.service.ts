import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
import { SystemRole, WorkspaceRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get accessSecret(): string {
    return (
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'kanbanex_access_secret_super_secure_key_change_in_production_32chars'
    );
  }

  private get refreshSecret(): string {
    return (
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'kanbanex_refresh_secret_super_secure_key_change_in_production_32chars'
    );
  }

  private get accessExpiresIn(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
  }

  private get refreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
  }

  /**
   * Generates JWT access and refresh token pair
   */
  async generateTokens(user: { id: string; email: string; role: string; fullName: string }) {
    const payload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      }),
    ]);

    // Save refresh session token in database
    const tokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 mins in seconds
    };
  }

  /**
   * Register a new user and provision their default workspace
   */
  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email.');
    }

    const passwordHash = await argon2.hash(dto.password);
    const normalizedEmail = dto.email.toLowerCase().trim();

    // The first user to register becomes the SUPER_ADMIN as per specifications
    const existingUsersCount = await this.prisma.user.count();
    const role = existingUsersCount === 0 ? SystemRole.SUPER_ADMIN : SystemRole.USER;

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: dto.fullName.trim(),
        role,
        isEmailVerified: true, // Immediate start as specified
      },
    });

    // Auto-create initial personal workspace
    const workspaceName = dto.workspaceName?.trim() || `Espace de ${user.fullName.split(' ')[0]}`;
    const baseSlug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'workspace';
    const slug = `${baseSlug}-${user.id.slice(0, 6)}`;

    const workspace = await this.prisma.workspace.create({
      data: {
        name: workspaceName,
        slug,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    });

    // Attach subscription plan to the new workspace (SUPER_ADMIN gets enterprise plan by default)
    const targetPlanSlug = role === SystemRole.SUPER_ADMIN ? 'enterprise' : 'basic';
    const plan = (await this.prisma.subscriptionPlan.findUnique({
      where: { slug: targetPlanSlug },
    })) || (await this.prisma.subscriptionPlan.findFirst());

    if (plan) {
      await this.prisma.subscription.create({
        data: {
          workspaceId: workspace.id,
          planId: plan.id,
          status: 'ACTIVE',
        },
      });
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      currentWorkspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      ...tokens,
    };
  }

  /**
   * Authenticate an existing user
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        workspaceMembers: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides (email ou mot de passe incorrect).');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides (email ou mot de passe incorrect).');
    }

    const tokens = await this.generateTokens(user);

    const primaryWorkspace = user.workspaceMembers[0]?.workspace;

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      currentWorkspace: primaryWorkspace
        ? {
            id: primaryWorkspace.id,
            name: primaryWorkspace.name,
            slug: primaryWorkspace.slug,
          }
        : null,
      ...tokens,
    };
  }

  /**
   * Refreshes JWT token with valid refresh token
   */
  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable.');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Jeton de rafraîchissement invalide ou expiré.');
    }
  }

  /**
   * Revoke session on logout
   */
  async logout(userId: string) {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    return { success: true, message: 'Déconnexion effectuée avec succès.' };
  }

  /**
   * Returns current user profile with workspaces
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        totpEnabled: true,
        createdAt: true,
        workspaceMembers: {
          include: {
            workspace: {
              include: {
                subscription: {
                  include: {
                    plan: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return user;
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const isValid = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!isValid) {
      throw new BadRequestException('Le mot de passe actuel est erroné.');
    }

    const newHash = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: 'Mot de passe modifié avec succès.' };
  }
}
