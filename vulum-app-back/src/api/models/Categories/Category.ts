import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Product } from '../Products/Product';

@Entity({ name: 'categories' })
export class Category extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  CategoryName: string;

  @Column()
  CategoryDescription: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @OneToMany(() => Product, (product) => product.Category)
  products: Product[];
}
