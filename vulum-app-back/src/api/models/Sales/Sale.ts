import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { User } from '../Users/User';

@Entity({ name: 'sales' })
export class Sale extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  SaleId: number;

  @Column()
  OrderId: number;

  @Column()
  UserId: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  TotalPrice: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @ManyToOne(() => User, (user) => user.Sales)
  user: User
}
