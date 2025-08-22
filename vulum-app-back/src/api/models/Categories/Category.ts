import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Product } from '../Products/Product';

@Entity({ name: 'categories' })
export class Category extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  category_name: string;

  @Column()
  category_description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @OneToMany(() => Product, (product) => product.category)
  productsList: Product[];
}
