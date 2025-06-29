import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Product } from '../Products/Product';

@Entity({ name: 'Product_images' })
export class ProductImages extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  image_url: string;

  @ManyToOne(() => Product, (product) => product.productImages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product_id: Product;
}
