import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString() title: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsArray() tags?: string[];
}

export class UpdateNoteDto extends CreateNoteDto {}