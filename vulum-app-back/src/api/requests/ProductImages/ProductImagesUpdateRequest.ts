import { IsNotEmpty, IsString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageUrlDto {
  @IsNotEmpty()
  @IsString()
  image_url: string;
}

export class ProductImagesUpdateRequest {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageUrlDto)
  images: ImageUrlDto[];
}