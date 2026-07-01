import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private model: Model<NoteDocument>) {}

  findAll(userId: string) { return this.model.find({ userId }).sort({ updatedAt: -1 }).exec(); }

  create(userId: string, dto: CreateNoteDto) {
    return this.model.create({ ...dto, userId: new Types.ObjectId(userId) });
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    const doc = await this.model.findOneAndUpdate({ _id: id, userId }, dto, { new: true });
    if (!doc) throw new NotFoundException('Note not found');
    return doc;
  }

  async delete(userId: string, id: string) {
    const doc = await this.model.findOneAndDelete({ _id: id, userId });
    if (!doc) throw new NotFoundException('Note not found');
    return { deleted: true };
  }
}