import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CategoryUpdateRequest {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  category_description: string;
}
