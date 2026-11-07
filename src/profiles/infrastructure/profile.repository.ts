import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Profile } from '../domain/profile.schema';
import { MembershipStateEnum } from '../../shared/enums';

@Injectable()
export class ProfileRepository {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async create(userId: Types.ObjectId, fullName: string, contact?: string): Promise<Profile> {
    const profile = new this.profileModel({
      userId,
      fullName,
      contact,
      membershipState: MembershipStateEnum.USUARIO,
    });
    return profile.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  async updateProfile(id: Types.ObjectId, data: Partial<Profile>): Promise<Profile | null> {
    return this.profileModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async updateMembershipState(
    id: Types.ObjectId,
    state: MembershipStateEnum,
  ): Promise<Profile | null> {
    return this.profileModel.findByIdAndUpdate(id, { membershipState: state }, { new: true }).exec();
  }

  async updateAvailableClasses(id: Types.ObjectId, count: number): Promise<Profile | null> {
    return this.profileModel.findByIdAndUpdate(id, { availableClasses: count }, { new: true }).exec();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }
}
