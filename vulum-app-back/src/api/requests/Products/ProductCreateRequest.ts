import { IsNotEmpty, IsString } from 'class-validator';

export class ProductCreateRequest {
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

  @IsNotEmpty()
  CreatedBy: number;
}
