import { IsNotEmpty } from 'class-validator';

export class FavoriteCreateRequest {
  @IsNotEmpty()
  ProductId: number;

  @IsNotEmpty()
  UserId: number;
}
