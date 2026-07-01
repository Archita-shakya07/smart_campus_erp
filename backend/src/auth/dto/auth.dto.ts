import { IsEmail, IsString, MinLength, Matches, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must have 1 uppercase letter and 1 number',
  }) password: string;

  @IsOptional() @IsIn(['student', 'admin'])
  role?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}