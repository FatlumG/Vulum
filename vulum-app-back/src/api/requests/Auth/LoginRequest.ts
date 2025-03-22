import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  Email: string;

  @IsNotEmpty()
  @IsString()
  Password: string;
}
