import { Order } from '@api/models/Orders/Order';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Order)
export class OrderRepository extends RepositoryBase<Order> {
  public async createOrder(data: object) {
    let entity = new Order();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateOrder(order: Order, data: object) {
    Object.assign(order, data);

    return await order.save(data);
  }
}
