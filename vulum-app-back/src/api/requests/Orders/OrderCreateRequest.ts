import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderCreateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber() 
  @IsNotEmpty()
  created_by: number;

  @IsNotEmpty()
  CreatedBy: number;

  @IsNotEmpty()
  TotalPrice: number;
}
