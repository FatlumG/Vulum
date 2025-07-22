import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
import { Exclude, Expose } from 'class-transformer';
import { Role } from './Role';
import { HashService } from '@base/infrastructure/services/hash/HashService';
import { Sale } from '../Sales/Sale';
import { Product } from '../Products/Product';
import { Pending } from '../Pendings/Pending';
import { Plan } from '../Plans/Plan';
import { Favorite } from '../Favorites/Favorite';

@Entity({ name: 'users' })
export class User extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  Username: string;

  @Column()
  Bio: string;

  @Column()
  @JoinColumn({ name: 'First Name' })
  FName: string;

  @Column()
  @JoinColumn({ name: 'Last Name' })
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

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'PricingPlan' })
  PricingPlan: Plan;

  @Column({ default: 0 })
  Products: number;

  @Column({ default: 0 })
  Orders: number;

  @Column({ default: 0 })
  Sales: number;

  @Column({ default: 0 })
  Favorites: number;

  @Column({ default: 0 })
  Pendings: number;

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
  async hashPasswordBeforeInsert() {
    if (this.Password) {
      this.Password = await new HashService().make(this.Password);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Hash only if the password is not already hashed
    if (this.Password && !this.Password.startsWith('$2b$')) {
      this.Password = await new HashService().make(this.Password);
    }
  }

  @BeforeInsert()
  async setDefaultRole() {
    const roleId = this.RoleId ? this.RoleId : 2;

    this.RoleId = roleId;
  }

  @OneToMany(() => Sale, (sale) => sale.user_id)
  sales: Sale[];

  @OneToMany(() => Product, (product) => product.CreatedBy)
  products: Product[];

  @OneToMany(() => Pending, (pending) => pending.UserId)
  pendings: Pending[];
}
