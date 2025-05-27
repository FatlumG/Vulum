import { IsNotEmpty, IsNumber } from 'class-validator';

export class PlanSubscribeRequest {
  @IsNotEmpty()
  @IsNumber()
  planId: number;
}
