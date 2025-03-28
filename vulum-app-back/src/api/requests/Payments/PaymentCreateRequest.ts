import { IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '@base/api/models/Payments/PEnum';

export class PaymentCreateRequest {
  @IsNotEmpty()
  OrderId: number;

  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  TotalPrice: number;

  StripePaymentId: number;

  @IsNotEmpty()
  Amount: number;

  PStatus: PaymentStatus;
}
