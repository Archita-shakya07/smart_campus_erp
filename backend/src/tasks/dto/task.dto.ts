import { IsString, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString() title: string;
  @IsOptional() @IsString() subject?: string;
  @IsDateString() dueDate: string;
  @IsOptional() @IsEnum(['high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() subject?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsEnum(['high', 'medium', 'low']) priority?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() isCompleted?: boolean;
}