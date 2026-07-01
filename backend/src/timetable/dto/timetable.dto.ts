import { IsString, IsEnum, IsOptional } from 'class-validator';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] as const;

export class CreateTimetableDto {
  @IsString() subject: string;
  @IsOptional() @IsString() teacher?: string;
  @IsOptional() @IsString() room?: string;
  @IsEnum(DAYS) day: typeof DAYS[number];
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsOptional() @IsString() colorTag?: string;
}