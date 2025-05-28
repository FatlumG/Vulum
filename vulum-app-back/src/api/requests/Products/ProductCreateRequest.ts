import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductCreateRequest {
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
