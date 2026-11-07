import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AuditEventEnum } from '../../shared/enums';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: String, required: true, enum: AuditEventEnum })
  eventType: AuditEventEnum;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  changedBy: Types.ObjectId;

  @Prop({ type: Object })
  oldValue: any;

  @Prop({ type: Object })
  newValue: any;

  @Prop()
  description: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
