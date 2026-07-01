import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) subject: string;
  @Prop({ required: true }) date: Date;
  @Prop({ enum: ['present', 'absent', 'late'], required: true }) status: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
