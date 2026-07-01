import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from '././attendance.schema';
import { CreateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(@InjectModel(Attendance.name) private model: Model<Attendance>) {}

  async findAll(userId: string) {
    return this.model.find({ userId }).sort({ date: -1 }).exec();
  }

  async create(userId: string, dto: CreateAttendanceDto) {
    const attendance = new this.model({ userId, ...dto });
    return attendance.save();
  }

  async update(userId: string, id: string, dto: CreateAttendanceDto) {
    const attendance = await this.model
      .findOneAndUpdate(
        { _id: id, userId },
        { ...dto, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }
    return attendance;
  }

  async getSummary(userId: string) {
    const records = await this.model.find({ userId }).exec();

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const overall = total > 0 ? Math.round((present / total) * 100) : 0;

    // Group by subject
    const subjectWise: Record<string, any> = {};
    records.forEach((record) => {
      if (!subjectWise[record.subject]) {
        subjectWise[record.subject] = { total: 0, present: 0, percentage: 0 };
      }
      subjectWise[record.subject].total += 1;
      if (record.status === 'present') {
        subjectWise[record.subject].present += 1;
      }
      subjectWise[record.subject].percentage = Math.round(
        (subjectWise[record.subject].present / subjectWise[record.subject].total) * 100,
      );
    });

    return {
      overall,
      total,
      present,
      absent,
      subjectWise,
    };
  }
}
