import { IsNotEmpty } from 'class-validator';

export class OrderItemUpdateRequest {
  @IsNotEmpty()
  order_id: number;

  @IsNotEmpty()
  product_id: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;
}
