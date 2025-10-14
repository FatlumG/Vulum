import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../Users/User';
import { Order } from '../Orders/Order';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'invoices' })
export class Invoice extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  stripe_invoice_id: string;

  @Column()
  stripe_customer_id: string;

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => Order, (order) => order.invoices, { nullable: true })
  @JoinColumn({name: 'order_id'})
  order: Order;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  hosted_invoice_url: string;

  @Column({ nullable: true, type: 'bigint' })
  amount_due: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}