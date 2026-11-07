import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../../src/audit/application/audit.service';
import { AuditLogRepository } from '../../src/audit/infrastructure/audit-log.repository';
import { AuditEventEnum } from '../../src/shared/enums';
import { Types } from 'mongoose';

describe('AuditService', () => {
  let service: AuditService;
  let repository: jest.Mocked<AuditLogRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: AuditLogRepository,
          useValue: {
            log: jest.fn(),
            findByUserId: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repository = module.get(AuditLogRepository) as jest.Mocked<AuditLogRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // T028: Test 6 audit events logging
  it('should log role_change event', async () => {
    const userId = new Types.ObjectId();
    const changedBy = new Types.ObjectId();
    repository.log.mockResolvedValue({} as any);

    await service.logEvent(
      AuditEventEnum.ROLE_CHANGE,
      userId,
      changedBy,
      { role: 'usuario' },
      { role: 'alumno' },
      'Role changed from usuario to alumno',
    );

    expect(repository.log).toHaveBeenCalledWith(
      AuditEventEnum.ROLE_CHANGE,
      userId,
      changedBy,
      { role: 'usuario' },
      { role: 'alumno' },
      'Role changed from usuario to alumno',
    );
  });

  it('should log available_classes_change event', async () => {
    const userId = new Types.ObjectId();
    const changedBy = new Types.ObjectId();
    repository.log.mockResolvedValue({} as any);

    await service.logEvent(
      AuditEventEnum.AVAILABLE_CLASSES_CHANGE,
      userId,
      changedBy,
      { availableClasses: 0 },
      { availableClasses: 5 },
      'Available classes updated from 0 to 5',
    );

    expect(repository.log).toHaveBeenCalled();
  });

  it('should retrieve audit logs for a user', async () => {
    const userId = new Types.ObjectId();
    const mockLogs = [
      {
        _id: new Types.ObjectId(),
        eventType: AuditEventEnum.ROLE_CHANGE,
        userId,
        timestamp: new Date(),
      },
    ];
    repository.findByUserId.mockResolvedValue(mockLogs as any);

    const result = await service.getAuditLog(userId);

    expect(result).toHaveLength(1);
    expect(result[0].eventType).toBe(AuditEventEnum.ROLE_CHANGE);
  });
});
