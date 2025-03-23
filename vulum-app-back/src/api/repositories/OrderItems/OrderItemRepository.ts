import { OrderItem } from '@api/models/OrderItems/OrderItem';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(OrderItem)
export class OrderItemRepository extends RepositoryBase<OrderItem> {
  public async createOrderItem(data: object) {
    let entity = new OrderItem();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateOrder(orderItem: OrderItem, data: object) {
    Object.assign(orderItem, data);

    return await orderItem.save(data);
  }
}
