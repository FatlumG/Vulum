import { IsNotEmpty, IsString } from 'class-validator';

export class OrderUpdateRequest {
  @IsNotEmpty()
  @IsString()
  OName: string;

  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  TotalPrice: number;
}
