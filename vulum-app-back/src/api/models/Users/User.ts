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
import { UserSubscription } from '../Subscriptions/UserSubscription';

@Entity({ name: 'users' })
export class User extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  bio: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  profile_photo_url?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Plan, { eager: true })
  pricing_plan: Plan;

  @Column({ default: 0 })
  products: number;

  @Column({ default: 0 })
  orders: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ default: 0 })
  favorites: number;

  @Column({ default: 0 })
  pendings: number;

  @Column({ default: 0 })
  todos: number;

  @Column({ default: 0 })
  payments: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: 5 })
  role_id: number;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  @Expose({ name: 'FullName' })
  get fullName() {
    return this.first_name + ' ' + this.last_name;
  }

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await new HashService().make(this.password);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Hash only if the password is not already hashed
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await new HashService().make(this.password);
    }
  }

  @BeforeInsert()
  async setDefaultRole() {
    const roleId = this.role_id ? this.role_id : 5;

    this.role_id = roleId;
  }

  @OneToMany(() => Sale, (sale) => sale.user_id)
  salesList: Sale[];

  @OneToMany(() => Product, (product) => product.createdBy)
  productsList: Product[];

  @OneToMany(() => Pending, (pending) => pending.user_id)
  pendingsList: Pending[];

  @OneToMany(() => Favorite, (favorite) => favorite.user_id)
  favoritesList: Favorite[];

  @OneToMany(() => UserSubscription, (UserSubscription) => UserSubscription.usersList)
  subscriptions: UserSubscription[];
}
