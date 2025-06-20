import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { ProductCreateRequest } from './ProductCreateRequest';
import { ProductImagesCreateRequest } from '../ProductImages/ProductImagesCreateRequest';

export class CreateProductWithImagesRequest {
  @ValidateNested()
  @Type(() => ProductCreateRequest)
  product: ProductCreateRequest;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImagesCreateRequest)
  images: ProductImagesCreateRequest[];
}
