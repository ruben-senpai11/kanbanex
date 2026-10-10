import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SystemRole, WorkspaceRole } from '@prisma/client';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;
  let mailService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      workspace: {
        create: jest.fn(),
      },
      subscriptionPlan: {
        findFirst: jest.fn(),
      },
      subscription: {
        create: jest.fn(),
      },
      session: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
      verifyAsync: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'secret_access_test_key_1234567890';
        if (key === 'JWT_REFRESH_SECRET') return 'secret_refresh_test_key_1234567890';
        return null;
      }),
    };

    mailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if user email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'exist@example.com' });

      await expect(
        service.signup({
          email: 'exist@example.com',
          password: 'Password123!',
          fullName: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user, workspace, and send verification email for first user (SUPER_ADMIN)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.count.mockResolvedValue(0); // first user -> SUPER_ADMIN
      prisma.user.create.mockResolvedValue({
        id: 'user-admin-1',
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: SystemRole.SUPER_ADMIN,
        isEmailVerified: false,
      });
      prisma.workspace.create.mockResolvedValue({
        id: 'ws-1',
        name: 'Espace de Admin',
        slug: 'espace-de-admin-user-a',
      });
      prisma.subscriptionPlan.findFirst.mockResolvedValue({
        id: 'plan-expansion',
        slug: 'expansion',
        name: 'Expansion',
      });
      prisma.subscription.create.mockResolvedValue({ id: 'sub-1' });

      const result = await service.signup({
        email: 'admin@example.com',
        password: 'SecurePassword123!',
        fullName: 'Admin User',
      });

      expect(result.success).toBe(true);
      expect(result.requiresEmailVerification).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'admin@example.com',
            role: SystemRole.SUPER_ADMIN,
          }),
        }),
      );
      expect(prisma.workspace.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'notfound@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hash = await argon2.hash('CorrectPassword123!');
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'user@example.com',
        passwordHash: hash,
        isEmailVerified: true,
        workspaceMembers: [],
      });

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      const password = 'CorrectPassword123!';
      const hash = await argon2.hash(password);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'unverified@example.com',
        passwordHash: hash,
        isEmailVerified: false,
        workspaceMembers: [],
      });

      await expect(
        service.login({
          email: 'unverified@example.com',
          password,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should login successfully with tokens and workspace info when credentials are valid', async () => {
      const password = 'ValidPassword123!';
      const hash = await argon2.hash(password);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u-valid',
        email: 'valid@example.com',
        fullName: 'Valid User',
        role: SystemRole.USER,
        passwordHash: hash,
        isEmailVerified: true,
        workspaceMembers: [
          {
            workspace: {
              id: 'ws-123',
              name: 'Mon Espace',
              slug: 'mon-espace',
            },
          },
        ],
      });
      prisma.session.create.mockResolvedValue({ id: 'session-1' });

      const result = await service.login({
        email: 'valid@example.com',
        password,
      });

      expect(result.user.id).toBe('u-valid');
      expect(result.currentWorkspace?.id).toBe('ws-123');
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
    });
  });

  describe('verifyEmail', () => {
    it('should throw BadRequestException if token is empty', async () => {
      await expect(service.verifyEmail({ token: '' })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if token is invalid or expired', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await expect(service.verifyEmail({ token: 'invalid-token-123' })).rejects.toThrow(BadRequestException);
    });

    it('should verify email and return tokens when token is valid and not expired', async () => {
      const validToken = 'valid-token-part';
      const futureExpiry = Date.now() + 3600000;
      const user = {
        id: 'u-token',
        email: 'token@example.com',
        fullName: 'Token User',
        role: SystemRole.USER,
        emailVerificationToken: `${validToken}:${futureExpiry}`,
        workspaceMembers: [],
      };

      prisma.user.findMany.mockResolvedValue([user]);
      prisma.user.update.mockResolvedValue({
        ...user,
        isEmailVerified: true,
        emailVerificationToken: null,
      });
      prisma.session.create.mockResolvedValue({ id: 'session-token' });

      const result = await service.verifyEmail({ token: validToken });
      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u-token' },
          data: { isEmailVerified: true, emailVerificationToken: null },
        }),
      );
      expect(result.accessToken).toBe('mock-token');
    });
  });
});
