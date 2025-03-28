import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Exclude, Expose } from 'class-transformer';
import { Role } from './Role';
import { HashService } from '@base/infrastructure/services/hash/HashService';
import { Sale } from '../Sales/Sale';

@Entity({ name: 'users' })
export class User extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  Username: string;

  @Column()
  FName: string;

  @Column()
  LName: string;

  @Column({ nullable: true })
  ProfilePhotoUrl?: string;

  @Column({ unique: true })
  Email: string;

  @Column()
  @Exclude()
  Password: string;

  @Column({ nullable: true })
  Phone?: string;

  @Column({ default: 1 })
  PricingPlan: number;

  @Column({ default: 0 })
  Products: number;

  @Column({ default: 0 })
  Orders: number;

  @Column({ default: 0 })
  Sales: number;

  @Column({ default: 0 })
  Favorites: number;

  @Column({ default: 0 })
  Todos: number;

  @Column({ default: 0 })
  Payments: number;

  @Column({ nullable: true })
  Address?: string;

  @Column()
  RoleId: number;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  @Expose({ name: 'FullName' })
  get fullName() {
    return this.FName + ' ' + this.LName;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.Password) this.Password = await new HashService().make(this.Password);
  }

  @BeforeInsert()
  async setDefaultRole() {
    const roleId = this.RoleId ? this.RoleId : 2;

    this.RoleId = roleId;
  }

  @OneToMany(() => Sale, (sale) => sale.UserId)
  sales: Sale[];
}
