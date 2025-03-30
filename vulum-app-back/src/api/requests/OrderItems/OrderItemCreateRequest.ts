import { IsNotEmpty } from 'class-validator';

export class OrderItemCreateRequest {
  @IsNotEmpty()
  OrderId: number;

  @IsNotEmpty()
  ProductId: number;

  @IsNotEmpty()
  Quantity: number;

  @IsNotEmpty()
  Price: number;
}
