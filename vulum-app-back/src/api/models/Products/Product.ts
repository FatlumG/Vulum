import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderItem } from '../OrderItems/OrderItem';
import { User } from '../Users/User';
import { ProductStatus } from './PEnum';
import { ProductImages } from '../ProductImages/ProductImage';

@Entity({ name: 'products' })
export class Product extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ProductName: string;

  @Column()
  ProductDescription: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  Price: number;

  @Column({ default: 1 })
  Stock: number;

  @Column()
  Category: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @Column()
  CreatedBy: number;

  @Column({ default: ProductStatus.PENDING })
  Status: ProductStatus;

  @Column()
  StripeProductId: string;

  @Column()
  StripePriceId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product_id)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.Products)
  @JoinColumn({ name: 'CreatedBy' })
  createdBy: User;

  @OneToMany(() => ProductImages, (productImages) => productImages.product_id)
  productImages: ProductImages[];
}
