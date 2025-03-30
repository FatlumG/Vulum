import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Product } from '../Products/Product';
import { Order } from '../Orders/Order';

@Entity({ name: 'orderitems' })
export class OrderItem extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  OrderId: number;

  @Column()
  ProductId: number;

  @Column()
  Quantity: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  Price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  OrderedAt: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OrderId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ProductId' })
  product: Product;
}
