import { IsString, IsOptional, IsNumber, IsEmail, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() course?: string;
  @IsOptional() @IsNumber() year?: number;
}

export class ChangePasswordDto {
  @IsString() currentPassword: string;
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must have 1 uppercase and 1 number',
  })
  newPassword: string;
}