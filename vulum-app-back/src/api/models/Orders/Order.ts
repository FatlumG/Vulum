import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { OrderStatus } from './Enum';

@Entity({ name: 'orders' })
export class Order extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  OrderId: number;

  @Column()
  OName: string;

  @Column()
  UserId: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  TotalPrice: number;

  @Column({ default: OrderStatus.PENDING })
  OStatus: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
