import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from '../infrastructure/user.repository';
import { RoleEnum } from '../../shared/enums';
import { DuplicateIdentityException } from '../../shared/exceptions/duplicate-identity.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(email: string): Promise<any> {
    // T005: Check for duplicate identity
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DuplicateIdentityException(`User with email ${email} already exists`);
    }

    // T005: New users start as 'usuario' role (CLARIFICACIÓN Q1)
    const user = await this.userRepository.create(email, RoleEnum.USUARIO);
    return { id: user._id, email: user.email, role: user.role };
  }

  async getUserById(id: Types.ObjectId): Promise<any> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user._id, email: user.email, role: user.role, isActive: user.isActive };
  }

  async updateUserRole(id: Types.ObjectId, newRole: RoleEnum): Promise<any> {
    // T006: Permission matrix - only certain roles can change other roles
    const user = await this.userRepository.updateRole(id, newRole);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user._id, email: user.email, role: user.role };
  }

  async deactivateUser(id: Types.ObjectId): Promise<any> {
    const user = await this.userRepository.deactivate(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user._id, email: user.email, isActive: user.isActive };
  }
}
