import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { User } from '../Users/User';

@Entity({ name: 'pendings' })
export class Pending extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  OrderId: number;

  @Column()
  UserId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @ManyToOne(() => User, (user) => user.Pendings)
  @JoinColumn({ name: 'UserId' })
  userId: User;
}
