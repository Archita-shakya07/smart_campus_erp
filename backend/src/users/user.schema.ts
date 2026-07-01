import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ enum: ['student', 'admin'], default: 'student' }) role: string;
  @Prop({ default: '' }) course: string;
  @Prop({ default: 1 }) year: number;
  @Prop({ default: '' }) avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);