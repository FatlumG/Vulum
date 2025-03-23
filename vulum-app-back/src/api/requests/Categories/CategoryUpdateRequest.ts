import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CategoryUpdateRequest {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  CategoryName: string;

  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  CategoryDescription: string;
}
