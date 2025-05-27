import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { User } from '../Users/User';
import { Order } from '../Orders/Order';
@Entity({ name: 'sales' })
export class Sale extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  total_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sold_at: string;

  @ManyToOne(() => User, (user) => user.Sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.id)
  order: Order;
}
