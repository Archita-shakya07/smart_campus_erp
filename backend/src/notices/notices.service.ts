import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notice, NoticeDocument } from './notice.schema';
import { CreateNoticeDto } from './dto/notice.dto';

@Injectable()
export class NoticesService {
  constructor(@InjectModel(Notice.name) private model: Model<NoticeDocument>) {}

  findAll() { return this.model.find().sort({ createdAt: -1 }).exec(); }

  create(adminId: string, dto: CreateNoticeDto) {
    return this.model.create({ ...dto, adminId: new Types.ObjectId(adminId) });
  }

  async update(id: string, dto: Partial<CreateNoticeDto>) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!doc) throw new NotFoundException('Notice not found');
    return doc;
  }

  async delete(id: string) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Notice not found');
    return { deleted: true };
  }
}
