import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'favorites' })
export class Favorite extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;
}
