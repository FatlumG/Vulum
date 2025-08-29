import { IsNotEmpty, IsString } from 'class-validator';

export class OrderUpdateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  created_by: number;

  @IsNotEmpty()
  amount: number;
}
