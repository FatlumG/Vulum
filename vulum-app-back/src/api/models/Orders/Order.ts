import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Exclude, Expose } from 'class-transformer';
import { HashService } from '@base/infrastructure/services/hash/HashService';

@Entity({ name: 'sales' })
export class Sale extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  OrderId: number;

  @Column()
  OName: string;

  @Column()
  UserId: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  TotalPrice: number;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: string;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

}