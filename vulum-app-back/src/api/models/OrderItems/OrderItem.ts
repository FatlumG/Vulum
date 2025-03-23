// import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';
// import { Order } from '../Orders/Order';

// @Entity({ name: 'sales' })
// export class Sale extends EntityBase {
//   @PrimaryGeneratedColumn('increment')
//   SaleId: number;

//   @Column()
//   OrderId: number;

//   @Column()
//   UserId: number;

//   @Column('decimal', { precision: 8, scale: 2, default: 0 })
//   TotalPrice: number;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   CreatedAt: string;

//   @ManyToOne(() => User, (user) => user.Sales)
//   user: User;

//   @ManyToMany(() => Order)
//   @JoinTable(() => OrderItems)
//   order: Order;
// }
