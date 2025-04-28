import { IsNotEmpty, IsString } from 'class-validator';

export class ProductUpdateRequest {
  @IsNotEmpty()
  @IsString()
  ProductName: string;

  @IsNotEmpty()
  @IsString()
  ProductDescription: string;

  @IsNotEmpty()
  Price: number;

  @IsNotEmpty()
  Stock: number;

  @IsNotEmpty()
  Category: number;
}
