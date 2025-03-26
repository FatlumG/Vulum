import { IsNotEmpty } from 'class-validator';

export class PendingUpdateRequest {
  @IsNotEmpty()
  OrderId: number;

  @IsNotEmpty()
  UserId: number;
}
