import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../domain/user.schema';
import { RoleEnum } from '../../shared/enums';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(email: string, role: RoleEnum = RoleEnum.USUARIO): Promise<User> {
    const user = new this.userModel({ email, role });
    return user.save();
  }

  async findById(id: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateRole(id: Types.ObjectId, role: RoleEnum): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }

  async deactivate(id: Types.ObjectId): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
