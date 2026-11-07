import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog } from '../domain/audit-log.schema';
import { AuditEventEnum } from '../../shared/enums';

@Injectable()
export class AuditLogRepository {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) {}

  async log(
    eventType: AuditEventEnum,
    userId: Types.ObjectId,
    changedBy: Types.ObjectId,
    oldValue: any,
    newValue: any,
    description: string,
  ): Promise<AuditLog> {
    const log = new this.auditLogModel({
      eventType,
      userId,
      changedBy,
      oldValue,
      newValue,
      description,
      timestamp: new Date(),
    });
    return log.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<AuditLog[]> {
    return this.auditLogModel.find({ userId }).sort({ timestamp: -1 }).exec();
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ timestamp: -1 }).exec();
  }
}
