import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FavoriteCreateRequest {
  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  ProductId: number;
}
