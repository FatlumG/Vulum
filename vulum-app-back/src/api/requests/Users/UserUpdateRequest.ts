import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class UserUpdateRequest {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  Username: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  FName: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  LName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  Email: string;

  @MinLength(9)
  Phone: string;

  @IsString()
  Address: string;

  @IsString()
  Bio: string;
}
