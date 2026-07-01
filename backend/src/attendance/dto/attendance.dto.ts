import { IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateAttendanceDto {
  @IsString() subject: string;
  @IsDateString() date: string;
  @IsEnum(['present', 'absent', 'late']) status: string;
}
