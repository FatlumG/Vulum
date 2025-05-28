import { IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItem {
  @IsNumber()
  @Min(1)
  product_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class OrderCreateRequest {
  // @IsArray() 
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];
}
