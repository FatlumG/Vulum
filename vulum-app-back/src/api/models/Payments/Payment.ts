import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { PaymentStatus } from './PEnum';
import { User } from '../Users/User';
import { Order } from '../Orders/Order';

@Entity({ name: 'payments' })
export class Payment extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  OrderId: string;

  @Column()
  UserId: string;

  @Column()
  StripePaymentId: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  Amount: number;

  @Column({ default: PaymentStatus.PENDING })
  PStatus: PaymentStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @ManyToOne(() => User, (user) => user.Payments)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @OneToMany(() => Order, (order) => order.id)
  order: Order;
}
