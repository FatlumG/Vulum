import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { BillingCycle } from './PEnum';

@Entity({ name: 'pricing' })
export class Plan extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  PlanId: number;

  @Column()
  PlanName: string;

  @Column()
  PlanDescription: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  Price: number;

  @Column({ default: BillingCycle.NONE })
  BillingCycle: BillingCycle;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
