import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OrderUpdateRequest {
  @IsNotEmpty()
  @IsString()
  OName: string;

  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  TotalPrice: number;
}
