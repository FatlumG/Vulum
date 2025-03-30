import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderStatus } from './OEnum';
import { OrderItem } from '../OrderItems/OrderItem';
import { User } from '../Users/User';

@Entity({ name: 'orders' })
export class Order extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  OName: string;

  @Column({ name: 'buyer' })
  UserId: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  TotalPrice: number;

  @Column({ default: OrderStatus.PENDING })
  OStatus: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @Column()
  @JoinColumn({ name: 'seller' })
  CreatedBy: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.OrderId)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.Orders)
  user: User;
}
