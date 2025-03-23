import { IsNotEmpty, IsString } from 'class-validator';
import { BillingCycle } from '@base/api/models/Plans/PEnum';

export class PlanUpdateRequest {
  @IsNotEmpty()
  @IsString()
  PlanName: string;

  @IsNotEmpty()
  @IsString()
  PlanDescription: string;

  @IsNotEmpty()
  Price: number;

  BillingCycle: BillingCycle;
}
