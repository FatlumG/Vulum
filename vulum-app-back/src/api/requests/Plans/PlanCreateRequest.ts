import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { BillingCycle } from '@base/api/models/Plans/PEnum';

export class PlanCreateRequest {
  @IsNotEmpty()
  @IsString()
  PlanName: string;

  @IsNotEmpty()
  @IsString()
  PlanDescription: string;

  @IsNotEmpty()
  @IsNumber()
  Price: number;

  @IsEnum(BillingCycle)
  BillingCycle: BillingCycle;
}
