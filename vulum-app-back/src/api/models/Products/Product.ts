import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'users' })
export class User extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  ProductId: number;

  @Column()
  ProductName: string;

  @Column()
  ProductDescription: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  Price: number;

  @Column({ default: 1 })
  Stock: number;

  @Column()
  Category: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
