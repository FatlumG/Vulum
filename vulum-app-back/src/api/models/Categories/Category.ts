import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'users' })
export class Category extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  CategoryId: number;

  @Column()
  CategoryName: string;

  @Column()
  CategoryDescription: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;
}
