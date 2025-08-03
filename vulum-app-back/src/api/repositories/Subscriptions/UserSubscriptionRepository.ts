import { UserSubscription } from '@base/api/models/Subscriptions/UserSubscription';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(UserSubscription)
export class UserSubscriptionRepository extends RepositoryBase<UserSubscription> {
  public async createUserSubscription(data: object) {
    let entity = new UserSubscription();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateUserSubscription(userSubscription: UserSubscription, data: object) {
    Object.assign(userSubscription, data);

    return await userSubscription.save(data);
  }
}
