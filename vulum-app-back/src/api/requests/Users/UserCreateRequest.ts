import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UserCreateRequest {
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

  @MaxLength(20)
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  Password: string;

  @IsNotEmpty()
  RoleId: number;
}
