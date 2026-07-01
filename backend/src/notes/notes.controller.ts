import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private service: NotesService) {}

  @Get()
  async getAll(@CurrentUser() u: any) {
    return { success: true, data: await this.service.findAll(u._id.toString()) };
  }

  @Post()
  async create(@CurrentUser() u: any, @Body() dto: CreateNoteDto) {
    return { success: true, data: await this.service.create(u._id.toString(), dto), message: 'Note created' };
  }

  @Put(':id')
  async update(@CurrentUser() u: any, @Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return { success: true, data: await this.service.update(u._id.toString(), id, dto), message: 'Note updated' };
  }

  @Delete(':id')
  async delete(@CurrentUser() u: any, @Param('id') id: string) {
    return { success: true, data: await this.service.delete(u._id.toString(), id), message: 'Note deleted' };
  }
}