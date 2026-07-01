import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop({ default: '' }) content: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ type: [String], default: [] }) attachments: string[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);