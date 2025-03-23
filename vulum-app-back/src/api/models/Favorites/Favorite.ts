import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'favorites' })
export class Favorite extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  FavoriteId: number;

  @Column()
  UserId: number;

  @Column()
  ProductId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
