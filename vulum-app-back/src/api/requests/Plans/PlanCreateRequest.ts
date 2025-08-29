import { IsNotEmpty, IsString, IsNumber, IsEnum, IsDecimal } from 'class-validator';
import { BillingCycle } from '@base/api/models/Plans/PEnum';

export class PlanCreateRequest {
  @IsNotEmpty()
  @IsString()
  plan_name: string;

  @IsNotEmpty()
  @IsString()
  plan_description: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsEnum(BillingCycle)
  billing_cycle: BillingCycle;
}
