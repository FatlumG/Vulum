import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavoriteCreateRequest {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
