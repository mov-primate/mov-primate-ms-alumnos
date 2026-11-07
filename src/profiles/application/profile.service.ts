import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProfileRepository } from '../infrastructure/profile.repository';
import { MembershipStateEnum } from '../../shared/enums';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(
    userId: Types.ObjectId,
    fullName: string,
    contact?: string,
  ): Promise<any> {
    // T009: Profile creation with initial membership state (usuario)
    const profile = await this.profileRepository.create(userId, fullName, contact);
    return this.formatProfile(profile);
  }

  async getProfileByUserId(userId: Types.ObjectId): Promise<any> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.formatProfile(profile);
  }

  async updateMembershipState(
    profileId: Types.ObjectId,
    newState: MembershipStateEnum,
  ): Promise<any> {
    // T010: Membership state machine (usuario, alumno_activo, alumno_sin_clases, alumno_bloqueado, alumno_inactivo)
    const profile = await this.profileRepository.updateMembershipState(profileId, newState);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.formatProfile(profile);
  }

  async updateAvailableClasses(profileId: Types.ObjectId, count: number): Promise<any> {
    // T024: available_classes es fuente de verdad
    const profile = await this.profileRepository.updateAvailableClasses(profileId, count);

    // Verificar que el perfil existe
    if (!profile) {
      throw new Error('Profile not found');
    }

    // T027: Automatic transition: if count = 0, transition to alumno_sin_clases
    if (count === 0 && profile.membershipState === MembershipStateEnum.ALUMNO_ACTIVO) {
      await this.profileRepository.updateMembershipState(
        profileId,
        MembershipStateEnum.ALUMNO_SIN_CLASES,
      );
    }

    return this.formatProfile(profile);
  }

  async updateProfile(profileId: Types.ObjectId, data: Partial<any>): Promise<any> {
    const profile = await this.profileRepository.updateProfile(profileId, data);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return this.formatProfile(profile);
  }

  private formatProfile(profile: any) {
    return {
      id: profile._id,
      userId: profile.userId,
      fullName: profile.fullName,
      contact: profile.contact,
      membershipState: profile.membershipState,
      availableClasses: profile.availableClasses,
      totalReservations: profile.totalReservations,
      reservationHistory: profile.reservationHistory,
      attendedCount: profile.attendedCount,
      missedCount: profile.missedCount,
      justifiedCount: profile.justifiedCount,
    };
  }
}
