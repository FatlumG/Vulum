import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { User } from '../Users/User';

@Entity({ name: 'pendings' })
export class Pending extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @ManyToOne(() => User, (user) => user.pendings)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
