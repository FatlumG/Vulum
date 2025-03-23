import { Service } from 'typedi';
import { OrderRepository } from '@api/repositories/Orders/OrderRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class OrderService {
  constructor(@InjectRepository() private orderRepository: OrderRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.orderRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedOrderOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let order = await this.orderRepository.createOrder(data);

    this.eventDispatcher.dispatch('onOrderCreate', order);

    return order;
  }

  public async updateOneById(id: number, data: object) {
    const order = await this.getRequestedOrderOrFail(id);

    return await this.orderRepository.updateOrder(order, data);
  }

  public async deleteOneById(id: number) {
    return await this.orderRepository.delete(id);
  }

  private async getRequestedOrderOrFail(id: number, resourceOptions?: object) {
    let order = await this.orderRepository.getOneById(id, resourceOptions);

    if (!order) {
      throw new CategoryNotFoundException();
    }

    return order;
  }
}
