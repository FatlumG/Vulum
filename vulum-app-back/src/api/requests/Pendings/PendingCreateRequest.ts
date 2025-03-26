import { IsNotEmpty } from 'class-validator';

export class PendingCreateRequest {
  @IsNotEmpty()
  OrderId: number;

  @IsNotEmpty()
  UserId: number;
}
