import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/timetable.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('timetable')
export class TimetableController {
  constructor(private service: TimetableService) {}

  @Get()
  async getAll(@CurrentUser() u: any) {
    return { success: true, data: await this.service.findAll(u._id.toString()) };
  }

  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateTimetableDto) {
    return { success: true, data: await this.service.create(u._id.toString(), dto), message: 'Entry added' };
  }

  @Put(':id')
  async update(@CurrentUser() u: any, @Param('id') id: string, @Body() dto: CreateTimetableDto) {
    return { success: true, data: await this.service.update(u._id.toString(), id, dto), message: 'Entry updated' };
  }

  @Delete(':id')
  async delete(@CurrentUser() u: any, @Param('id') id: string) {
    return { success: true, data: await this.service.delete(u._id.toString(), id), message: 'Entry deleted' };
  }
}