import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OrderCreateRequest {
  @IsNotEmpty()
  @IsString()
  OName: string;

  @IsNotEmpty()
  UserId: number;

  @IsNotEmpty()
  CreatedBy: number;

  @IsNotEmpty()
  TotalPrice: number;
}
