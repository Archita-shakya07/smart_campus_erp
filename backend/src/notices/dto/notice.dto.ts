import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateNoticeDto {
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsEnum(['general', 'exam', 'event', 'holiday']) category?: string;
}
