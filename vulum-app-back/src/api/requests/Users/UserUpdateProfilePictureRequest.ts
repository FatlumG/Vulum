import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class UserUpdateProfilePictureRequest {
  @IsNotEmpty()
  image: any;
}
