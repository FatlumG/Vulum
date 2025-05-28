import { IsNotEmpty, IsNumber, IsString, IsDecimal } from 'class-validator';

export class ProductUpdateRequest {
  @IsNotEmpty()
  @IsString()
  ProductName: string;

  @IsNotEmpty()
  @IsString()
  ProductDescription: string;

  @IsDecimal()
  @IsNotEmpty()
  Price: number;

  @IsNumber()
  @IsNotEmpty()
  Stock: number;

  @IsNumber()
  @IsNotEmpty()
  Category: number;
}
