import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class FavoriteUpdateRequest {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
