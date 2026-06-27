import { Test, type TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto: RegisterDto = {
      email: 'new@user.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      role: 'tenant',
    };

    it('should register a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'u1',
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        role: 'tenant',
        avatar: null,
        createdAt: new Date(),
      });

      const result = await service.register(dto);
      expect(result.user.email).toBe('new@user.com');
      expect(result.token).toBe('mock-token');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@user.com',
            role: 'tenant',
          }),
        }),
      );
    });

    it('should throw ConflictException for duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing',
        email: dto.email,
      });
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto: LoginDto = { email: 'test@user.com', password: 'password123' };

    it('should login with valid credentials', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@user.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'User',
        role: 'tenant',
        avatar: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.login(dto);
      expect(result.user.email).toBe('test@user.com');
      expect(result.token).toBe('mock-token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const passwordHash = await bcrypt.hash('wrongpass', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@user.com',
        passwordHash,
      });

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@user.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'tenant',
        phone: null,
        avatar: null,
        createdAt: new Date(),
      });

      const result = await service.getProfile('u1');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@user.com');
    });

    it('should return null for unknown user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.getProfile('nonexistent');
      expect(result).toBeNull();
    });
  });
});
