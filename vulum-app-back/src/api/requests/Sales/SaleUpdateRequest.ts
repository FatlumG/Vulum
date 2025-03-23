import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaleUpdateRequest {
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
