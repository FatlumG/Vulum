import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Product } from '../Products/Product';
import { Order } from '../Orders/Order';

@Entity({ name: 'orderitems' })
export class OrderItem extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  ordersList: Order;

  @ManyToOne(() => Product, (product) => product.orderItemsList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  productsList: Product;
}
