import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsNotEmpty } from 'class-validator';
import { ProductUpdateRequest } from './ProductUpdateRequest';
import { ProductImagesUpdateRequest } from '../ProductImages/ProductImagesUpdateRequest';

export class UpdateProductWithImagesRequest {
  @ValidateNested()
  @Type(() => ProductUpdateRequest)
  product: ProductUpdateRequest;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImagesUpdateRequest)
  images: ProductImagesUpdateRequest[];
}
