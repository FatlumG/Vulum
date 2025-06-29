import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavoriteCreateRequest {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
