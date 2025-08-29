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
  plan_name: string;

  @Column()
  plan_description: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  price: number;

  @Column({ default: BillingCycle.NONE })
  billing_cycle: BillingCycle;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ nullable: true })
  stripe_price_id: string;

  @Column({ nullable: true })
  stripe_product_id: string;

  @OneToMany(() => User, (user) => user.pricing_plan)
  users: User[];

  @OneToMany(() => UserSubscription, (subscription) => subscription.plansList)
  subscriptions: UserSubscription[];
}
