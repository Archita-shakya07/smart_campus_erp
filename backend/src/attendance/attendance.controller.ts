import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Get()
  async getAll(@CurrentUser() u: any) {
    return {
      success: true,
      data: await this.service.findAll(u._id.toString()),
      message: 'Attendance records fetched',
    };
  }

  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateAttendanceDto) {
    return {
      success: true,
      data: await this.service.create(u._id.toString(), dto),
      message: 'Attendance marked successfully',
    };
  }

  @Put(':id')
  async update(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: CreateAttendanceDto,
  ) {
    return {
      success: true,
      data: await this.service.update(u._id.toString(), id, dto),
      message: 'Attendance updated successfully',
    };
  }

  @Get('summary')
  async getSummary(@CurrentUser() u: any) {
    return {
      success: true,
      data: await this.service.getSummary(u._id.toString()),
      message: 'Attendance summary fetched',
    };
  }
}
