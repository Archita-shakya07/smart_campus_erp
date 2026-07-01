import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notice, NoticeSchema } from './notice.schema';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notice.name, schema: NoticeSchema }])],
  providers: [NoticesService],
  controllers: [NoticesController],
})
export class NoticesModule {}