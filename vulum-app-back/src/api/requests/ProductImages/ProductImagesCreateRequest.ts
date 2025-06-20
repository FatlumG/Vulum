import { IsNotEmpty, IsString } from 'class-validator';

export class ProductImagesCreateRequest {
  @IsNotEmpty()
  @IsString()
  image_url: ProductImagesCreateRequest[];
}
