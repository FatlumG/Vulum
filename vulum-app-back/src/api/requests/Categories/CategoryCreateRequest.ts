import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CategoryCreateRequest {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  category_description: string;
}
