import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderCreateRequest {
  @IsNotEmpty()
  @IsString()
  OName: string;

  @IsNumber() 
  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  CreatedBy: number;

  @IsNotEmpty()
  TotalPrice: number;
}
