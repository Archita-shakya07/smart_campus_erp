import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAll(@CurrentUser() user: any) {
    const data = await this.tasksService.findAll(user._id.toString());
    return { success: true, data };
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateTaskDto) {
    const data = await this.tasksService.create(user._id.toString(), dto);
    return { success: true, data, message: 'Task created' };
  }

  @Put(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const data = await this.tasksService.update(user._id.toString(), id, dto);
    return { success: true, data, message: 'Task updated' };
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.tasksService.delete(user._id.toString(), id);
    return { success: true, data, message: 'Task deleted' };
  }

  @Patch(':id/complete')
  async toggle(@CurrentUser() user: any, @Param('id') id: string) {
    const data = await this.tasksService.toggleComplete(user._id.toString(), id);
    return { success: true, data, message: 'Task toggled' };
  }
}
