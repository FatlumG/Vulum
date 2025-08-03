import { Service } from 'typedi';
import { UserSubscriptionRepository } from '@api/repositories/Subscriptions/UserSubscriptionRepository';
import { UserSubscriptionCreateRequest } from '@base/api/requests/Subscriptions/UserSubscriptionCreateRequest';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class SubscriptionsService {
  constructor(@InjectRepository() private userSubscriptionRepository: UserSubscriptionRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.userSubscriptionRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedSubscriptionsOrFail(id, resourceOptions);
  }

  public async create(data: UserSubscriptionCreateRequest) {
    let subscriptions = await this.userSubscriptionRepository.createUserSubscription(data);

    this.eventDispatcher.dispatch('onSubscriptionsCreate', subscriptions);

    return subscriptions;
  }

  public async updateOneById(id: number, data: object) {
    const subscriptions = await this.getRequestedSubscriptionsOrFail(id);

    return await this.userSubscriptionRepository.updateUserSubscription(subscriptions, data);
  }

  public async deleteOneById(id: number) {
    return await this.userSubscriptionRepository.delete(id);
  }

  private async getRequestedSubscriptionsOrFail(id: number, resourceOptions?: object) {
    let subscriptions = await this.userSubscriptionRepository.getOneById(id, resourceOptions);

    if (!subscriptions) {
      throw new CategoryNotFoundException();
    }

    return subscriptions;
  }
}
