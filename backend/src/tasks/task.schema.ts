import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop({ default: '' }) subject: string;
  @Prop({ required: true }) dueDate: Date;
  @Prop({ enum: ['high', 'medium', 'low'], default: 'medium' }) priority: string;
  @Prop({ default: '' }) description: string;
  @Prop({ default: false }) isCompleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);