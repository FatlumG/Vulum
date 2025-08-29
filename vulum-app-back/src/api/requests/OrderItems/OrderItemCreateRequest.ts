import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemCreateRequest {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
