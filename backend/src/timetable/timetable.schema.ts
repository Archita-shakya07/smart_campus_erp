import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimetableDocument = Timetable & Document;

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

@Schema()
export class Timetable {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) subject: string;
  @Prop({ default: '' }) teacher: string;
  @Prop({ default: '' }) room: string;
  @Prop({ enum: DAYS, required: true }) day: string;
  @Prop({ required: true }) startTime: string;
  @Prop({ required: true }) endTime: string;
  @Prop({ default: '#0D5C63' }) colorTag: string;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);