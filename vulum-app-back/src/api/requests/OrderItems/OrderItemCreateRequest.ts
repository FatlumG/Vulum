import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemCreateRequest {
  @IsNumber()
  @IsNotEmpty()
  OrderId: number;

  @IsNumber()
  @IsNotEmpty()
  ProductId: number;

  @IsNumber()
  @IsNotEmpty()
  Quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  Price: number;
}
