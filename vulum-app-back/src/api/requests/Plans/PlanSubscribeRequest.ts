import { IsNotEmpty, IsNumber } from 'class-validator';

export class PlanSubscribeRequest {
  @IsNumber()
  @IsNotEmpty()
  plan_id: number;
}
