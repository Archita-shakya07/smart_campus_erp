import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/notice.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notices')
export class NoticesController {
  constructor(private service: NoticesService) {}

  @Get()
  async getAll() {
    return { success: true, data: await this.service.findAll() };
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@CurrentUser() u: any, @Body() dto: CreateNoticeDto) {
    return { success: true, data: await this.service.create(u._id.toString(), dto), message: 'Notice posted' };
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() dto: CreateNoticeDto) {
    return { success: true, data: await this.service.update(id, dto), message: 'Notice updated' };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return { success: true, data: await this.service.delete(id), message: 'Notice deleted' };
  }
}
