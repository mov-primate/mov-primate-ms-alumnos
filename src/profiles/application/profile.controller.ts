import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { ProfileService } from '../application/profile.service';
import { MembershipStateEnum } from '../../shared/enums';
import { Types } from 'mongoose';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async createProfile(
    @Body() body: { userId: string; fullName: string; contact?: string },
  ): Promise<any> {
    // T009: Create profile with membership tracking
    return this.profileService.createProfile(
      new Types.ObjectId(body.userId),
      body.fullName,
      body.contact,
    );
  }

  @Get('user/:userId')
  async getProfileByUserId(@Param('userId') userId: string): Promise<any> {
    // T011: Profile access control by role
    return this.profileService.getProfileByUserId(new Types.ObjectId(userId));
  }

  @Put(':id/membership-state')
  async updateMembershipState(
    @Param('id') id: string,
    @Body() body: { state: MembershipStateEnum },
  ): Promise<any> {
    // T010: Update 5-state membership machine
    return this.profileService.updateMembershipState(
      new Types.ObjectId(id),
      body.state,
    );
  }

  @Put(':id/available-classes')
  async updateAvailableClasses(
    @Param('id') id: string,
    @Body() body: { count: number },
  ): Promise<any> {
    // T024: Update available_classes (superadmin only)
    // T027: Automatic transition if count = 0
    return this.profileService.updateAvailableClasses(new Types.ObjectId(id), body.count);
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    // T009: Update profile
    return this.profileService.updateProfile(new Types.ObjectId(id), body);
  }
}
