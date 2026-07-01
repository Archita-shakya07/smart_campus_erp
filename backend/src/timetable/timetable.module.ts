import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Timetable, TimetableSchema } from './timetable.schema';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }])],
  providers: [TimetableService],
  controllers: [TimetableController],
})
export class TimetableModule {}