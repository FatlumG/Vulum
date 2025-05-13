import { IsNotEmpty } from 'class-validator';

export class FavoriteCreateRequest {
  @IsNotEmpty()
  product_id: number;
}
