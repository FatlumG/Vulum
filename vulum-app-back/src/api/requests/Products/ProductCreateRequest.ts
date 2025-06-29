import { IsNotEmpty, IsNumber, IsString, } from 'class-validator';

export class ProductCreateRequest {
  @IsNotEmpty()
  @IsString()
  ProductName: string;

  @IsNotEmpty()
  @IsString()
  ProductDescription: string;

  @IsNumber()
  @IsNotEmpty()
  Price: number;

  @IsNumber()
  @IsNotEmpty()
  Stock: number;

  @IsNumber()
  @IsNotEmpty()
  Category: number;
}
