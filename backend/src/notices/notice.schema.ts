import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) adminId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) body: string;
  @Prop({ enum: ['general', 'exam', 'event', 'holiday'], default: 'general' }) category: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);