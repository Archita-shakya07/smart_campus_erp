import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Timetable, TimetableDocument } from './timetable.schema';
import { CreateTimetableDto } from './dto/timetable.dto';

@Injectable()
export class TimetableService {
  constructor(@InjectModel(Timetable.name) private model: Model<TimetableDocument>) {}

  findAll(userId: string) { return this.model.find({ userId }).exec(); }

  create(userId: string, dto: CreateTimetableDto) {
    return this.model.create({ ...dto, userId: new Types.ObjectId(userId) });
  }

  async update(userId: string, id: string, dto: Partial<CreateTimetableDto>) {
    const doc = await this.model.findOneAndUpdate({ _id: id, userId }, dto, { new: true });
    if (!doc) throw new NotFoundException('Entry not found');
    return doc;
  }

  async delete(userId: string, id: string) {
    const doc = await this.model.findOneAndDelete({ _id: id, userId });
    if (!doc) throw new NotFoundException('Entry not found');
    return { deleted: true };
  }
}