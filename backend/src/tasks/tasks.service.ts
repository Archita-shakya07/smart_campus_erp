import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(userId: string) {
    return this.taskModel.find({ userId }).sort({ dueDate: 1 }).exec();
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.taskModel.create({ ...dto, userId: new Types.ObjectId(userId) });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, userId }, dto, { new: true }
    );
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async delete(userId: string, id: string) {
    const task = await this.taskModel.findOneAndDelete({ _id: id, userId });
    if (!task) throw new NotFoundException('Task not found');
    return { deleted: true };
  }

  async toggleComplete(userId: string, id: string) {
    const task = await this.taskModel.findOne({ _id: id, userId });
    if (!task) throw new NotFoundException('Task not found');
    task.isCompleted = !task.isCompleted;
    return task.save();
  }
}