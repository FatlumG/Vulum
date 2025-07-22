import { IsNotEmpty } from 'class-validator';

export class UserUpdateProfilePictureRequest {
  @IsNotEmpty()
  image: any;
}
