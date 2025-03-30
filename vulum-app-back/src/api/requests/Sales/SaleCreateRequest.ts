import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaleCreateRequest {
  @IsNumber()
  @IsNotEmpty()
  OrderId: number;

  @IsNumber()
  @IsNotEmpty()
  UserId: number;

  @IsNumber()
  @IsNotEmpty()
  TotalPrice: number;
}
