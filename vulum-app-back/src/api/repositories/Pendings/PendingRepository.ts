import { Pending } from '@api/models/Pendings/Pending';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Pending)
export class PendingRepository extends RepositoryBase<Pending> {
  public async createPending(data: object) {
    let entity = new Pending();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updatePending(pending: Pending, data: object) {
    Object.assign(pending, data);

    return await pending.save(data);
  }
}
