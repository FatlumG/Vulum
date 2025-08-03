import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { BillingCycle } from './PEnum';
import { User } from '../Users/User';
import { UserSubscription } from '../Subscriptions/UserSubscription';

@Entity({ name: 'pricing' })
export class Plan extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @Column({ nullable: true })
  StripePriceId: string;

  @Column({ nullable: true })
  StripeProductId: string;

  @OneToMany(() => User, (user) => user.PricingPlan)
  users: User[];

  @OneToMany(() => UserSubscription, (subscription) => subscription.plan)
  subscriptions: UserSubscription[];
}
