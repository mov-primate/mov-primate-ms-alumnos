import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/members/application/user.service';
import { UserRepository } from '../../src/members/infrastructure/user.repository';
import { RoleEnum } from '../../src/shared/enums';
import { Types } from 'mongoose';
import { DuplicateIdentityException } from '../../src/shared/exceptions/duplicate-identity.exception';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateRole: jest.fn(),
            deactivate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository) as jest.Mocked<UserRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // T005: Test that new users start with 'usuario' role
  it('should create user with role "usuario"', async () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      role: RoleEnum.USUARIO,
    };
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockResolvedValue(mockUser as any);

    const result = await service.createUser('test@example.com');

    expect(result.role).toBe(RoleEnum.USUARIO);
    expect(repository.create).toHaveBeenCalledWith('test@example.com', RoleEnum.USUARIO);
  });

  // T008: Test duplicate identity prevention
  it('should throw error on duplicate email', async () => {
    const existingUser = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      role: RoleEnum.USUARIO,
    };
    repository.findByEmail.mockResolvedValue(existingUser as any);

    await expect(service.createUser('test@example.com')).rejects.toThrow(
      DuplicateIdentityException,
    );
  });

  // T015: Test role update (promotion)
  it('should update user role', async () => {
    const userId = new Types.ObjectId();
    const mockUser = {
      _id: userId,
      email: 'test@example.com',
      role: RoleEnum.ALUMNO,
    };
    repository.updateRole.mockResolvedValue(mockUser as any);

    const result = await service.updateUserRole(userId, RoleEnum.ALUMNO);

    expect(result.role).toBe(RoleEnum.ALUMNO);
    expect(repository.updateRole).toHaveBeenCalledWith(userId, RoleEnum.ALUMNO);
  });

  // T015: Test deactivation
  it('should deactivate user', async () => {
    const userId = new Types.ObjectId();
    const mockUser = {
      _id: userId,
      email: 'test@example.com',
      isActive: false,
    };
    repository.deactivate.mockResolvedValue(mockUser as any);

    const result = await service.deactivateUser(userId);

    expect(result.isActive).toBe(false);
  });
});
