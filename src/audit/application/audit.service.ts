import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuditLogRepository } from '../infrastructure/audit-log.repository';
import { AuditEventEnum } from '../../shared/enums';

@Injectable()
export class AuditService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async logEvent(
    eventType: AuditEventEnum,
    userId: Types.ObjectId,
    changedBy: Types.ObjectId,
    oldValue: any,
    newValue: any,
    description: string,
  ): Promise<void> {
    // T028: Log 6 audit events (CLARIFICACIÓN Q5)
    await this.auditLogRepository.log(
      eventType,
      userId,
      changedBy,
      oldValue,
      newValue,
      description,
    );
  }

  async getAuditLog(userId: Types.ObjectId): Promise<any[]> {
    const logs = await this.auditLogRepository.findByUserId(userId);
    return logs.map((log) => ({
      id: log._id,
      eventType: log.eventType,
      userId: log.userId,
      changedBy: log.changedBy,
      oldValue: log.oldValue,
      newValue: log.newValue,
      description: log.description,
      timestamp: log.timestamp,
    }));
  }

  async getAllAuditLogs(): Promise<any[]> {
    const logs = await this.auditLogRepository.findAll();
    return logs.map((log) => ({
      id: log._id,
      eventType: log.eventType,
      userId: log.userId,
      changedBy: log.changedBy,
      description: log.description,
      timestamp: log.timestamp,
    }));
  }
}
