import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../../src/profiles/application/profile.service';
import { ProfileRepository } from '../../src/profiles/infrastructure/profile.repository';
import { MembershipStateEnum } from '../../src/shared/enums';
import { Types } from 'mongoose';

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: jest.Mocked<ProfileRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
            updateMembershipState: jest.fn(),
            updateAvailableClasses: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repository = module.get(ProfileRepository) as jest.Mocked<ProfileRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // T010: Test 5-state membership state machine
  it('should transition through membership states', async () => {
    const profileId = new Types.ObjectId();
    const mockProfile = {
      _id: profileId,
      userId: new Types.ObjectId(),
      fullName: 'Test User',
      membershipState: MembershipStateEnum.ALUMNO_ACTIVO,
    };
    repository.updateMembershipState.mockResolvedValue(mockProfile as any);

    const result = await service.updateMembershipState(
      profileId,
      MembershipStateEnum.ALUMNO_ACTIVO,
    );

    expect(result.membershipState).toBe(MembershipStateEnum.ALUMNO_ACTIVO);
  });

  // T027: Test automatic transition when available_classes = 0
  it('should automatically transition from alumno_activo to alumno_sin_clases when available_classes = 0',
    async () => {
      const profileId = new Types.ObjectId();
      const mockProfile = {
        _id: profileId,
        availableClasses: 0,
        membershipState: MembershipStateEnum.ALUMNO_ACTIVO,
      };
      repository.updateAvailableClasses.mockResolvedValue(mockProfile as any);
      repository.updateMembershipState.mockResolvedValue({
        ...mockProfile,
        membershipState: MembershipStateEnum.ALUMNO_SIN_CLASES,
      } as any);

      await service.updateAvailableClasses(profileId, 0);

      expect(repository.updateMembershipState).toHaveBeenCalledWith(
        profileId,
        MembershipStateEnum.ALUMNO_SIN_CLASES,
      );
    },
  );

  // T024: Test available_classes update
  it('should update available_classes', async () => {
    const profileId = new Types.ObjectId();
    const mockProfile = {
      _id: profileId,
      availableClasses: 5,
      membershipState: MembershipStateEnum.ALUMNO_ACTIVO,
    };
    repository.updateAvailableClasses.mockResolvedValue(mockProfile as any);

    const result = await service.updateAvailableClasses(profileId, 5);

    expect(result.availableClasses).toBe(5);
    expect(repository.updateAvailableClasses).toHaveBeenCalledWith(profileId, 5);
  });
});
