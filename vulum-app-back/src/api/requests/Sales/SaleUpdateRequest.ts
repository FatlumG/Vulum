import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaleUpdateRequest {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;
}
