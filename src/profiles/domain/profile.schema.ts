import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MembershipStateEnum } from '../../shared/enums';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  contact: string;

  @Prop({ type: String, enum: MembershipStateEnum, default: MembershipStateEnum.USUARIO })
  membershipState: MembershipStateEnum;

  @Prop({ default: 0 })
  availableClasses: number;

  @Prop({ default: 0 })
  totalReservations: number;

  @Prop({ type: [Object], default: [] })
  reservationHistory: any[];

  @Prop({ default: 0 })
  attendedCount: number;

  @Prop({ default: 0 })
  missedCount: number;

  @Prop({ default: 0 })
  justifiedCount: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
