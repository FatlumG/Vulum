import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'users' })
export class User extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  PlanId: number;

  @Column()
  PlanName: string;

  @Column()
  PlanDescription: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  Price: number;

  @Column()
  BillingCycle: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
