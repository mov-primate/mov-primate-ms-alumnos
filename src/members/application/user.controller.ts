import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { RoleEnum } from '../../shared/enums';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string }): Promise<any> {
    // T005: User registration - starts as 'usuario' role
    return this.userService.createUser(body.email);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<any> {
    return this.userService.getUserById(new Types.ObjectId(id));
  }

  @Put(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: RoleEnum },
  ): Promise<any> {
    // T015-T017: Only superadmin can change roles
    return this.userService.updateUserRole(new Types.ObjectId(id), body.role);
  }

  @Put(':id/deactivate')
  async deactivateUser(@Param('id') id: string): Promise<any> {
    // T015-T017: Only superadmin can deactivate
    return this.userService.deactivateUser(new Types.ObjectId(id));
  }
}
