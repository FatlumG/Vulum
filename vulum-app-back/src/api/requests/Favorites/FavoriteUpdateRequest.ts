import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FavoriteUpdateRequest {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  product_id: number;
}
