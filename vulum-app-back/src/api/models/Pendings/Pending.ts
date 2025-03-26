import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'pendings' })
export class Pending extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  PendingId: number;

  @Column()
  OrderId: number;

  @Column()
  UserId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
