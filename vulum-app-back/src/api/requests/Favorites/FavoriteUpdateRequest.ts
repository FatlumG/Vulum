import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FavoriteUpdateRequest {
  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  ProductId: number;
}
