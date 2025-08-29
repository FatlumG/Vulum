import { IsNotEmpty, IsNumber } from 'class-validator';

export class PendingCreateRequest {
  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}
