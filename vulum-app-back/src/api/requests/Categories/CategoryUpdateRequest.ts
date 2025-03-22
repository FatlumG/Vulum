import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CategoryUpdateRequest {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  CategoryName: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  CategoryDescription: string;
}
