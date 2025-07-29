import { IsNotEmpty, IsNumber } from 'class-validator';

export class PlanSubscribeRequest {
  @IsNumber()
  @IsNotEmpty()
  planId: number;
}
