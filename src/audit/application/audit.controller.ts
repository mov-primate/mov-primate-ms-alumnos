import { Controller, Get, Param } from '@nestjs/common';
import { AuditService } from '../../../src/audit/application/audit.service'; 
import { Types } from 'mongoose';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs/:userId')
  async getAuditLogByUserId(@Param('userId') userId: string): Promise<any> {
    // T018: Get audit trail for a user
    return this.auditService.getAuditLog(new Types.ObjectId(userId));
  }

  @Get('logs')
  async getAllAuditLogs(): Promise<any> {
    // T018: Get all audit logs (superadmin)
    return this.auditService.getAllAuditLogs();
  }
}
