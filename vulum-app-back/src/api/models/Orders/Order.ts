import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderStatus } from './OEnum';
import { OrderItem } from '../OrderItems/OrderItem';
import { User } from '../Users/User';
import { Invoice } from '../Invoices/Invoice';
@Entity({ name: 'orders' })
export class Order extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  amount: number;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column()
  created_by: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.ordersList)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => Invoice, (invoice) => invoice.order)
  @JoinColumn({ name: 'invoice_id' })
  invoices: Invoice[];
}
