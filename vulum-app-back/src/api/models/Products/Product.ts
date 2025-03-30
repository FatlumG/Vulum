import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderItem } from '../OrderItems/OrderItem';
import { User } from '../Users/User';

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.ProductId)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.Products)
  user: User;
}
