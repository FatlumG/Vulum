import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderItem } from '../OrderItems/OrderItem';
import { User } from '../Users/User';
import { ProductStatus } from './PEnum';
import { ProductImages } from '../ProductImages/ProductImage';
import { Favorite } from '../Favorites/Favorite';
import { Category } from '../Categories/Category';

@Entity({ name: 'products' })
export class Product extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  product_name: string;

  @Column()
  product_description: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  price: number;

  @Column({ default: 1 })
  stock: number;

  @Column()
  category_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column()
  created_by: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PENDING,
  })
  status: ProductStatus;

  @Column()
  stripe_price_id: string;

  @Column()
  stripe_product_id: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productsList)
  orderItemsList: OrderItem[];

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => ProductImages, (productImages) => productImages.product_id)
  productImages: ProductImages[];

  @OneToMany(() => Favorite, (favorite) => favorite.product_id)
  favoritesList: Favorite[];

  @ManyToOne(() => Category, (category) => category.productsList)
  @JoinColumn({ name: 'Category' })
  category: Category;
}
