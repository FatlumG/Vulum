import { IsNotEmpty, IsNumber } from 'class-validator';

export class PendingUpdateRequest {
  @IsNotEmpty()
  @IsNumber()
  OrderId: number;
}
