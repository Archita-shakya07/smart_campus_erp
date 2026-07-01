import { Controller, Get, Put, Patch, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Get()
  async getProfile(@CurrentUser() u: any) {
    return { success: true, data: await this.usersService.findById(u._id.toString()) };
  }

  @Put()
  async updateProfile(@CurrentUser() u: any, @Body() dto: UpdateProfileDto) {
    const data = await this.usersService.update(u._id.toString(), dto);
    return { success: true, data, message: 'Profile updated' };
  }

  @Patch('password')
  async changePassword(@CurrentUser() u: any, @Body() dto: ChangePasswordDto) {
    const user = await this.userModel.findById(u._id);
    if (!user) throw new UnauthorizedException();
    const match = await bcrypt.compare(dto.currentPassword, user.password);
    if (!match) throw new UnauthorizedException('Current password is wrong');
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    return { success: true, message: 'Password changed' };
  }
}