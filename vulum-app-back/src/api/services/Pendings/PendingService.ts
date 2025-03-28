import { Service } from 'typedi';
import { PendingRepository } from '@api/repositories/Pendings/PendingRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class PendingService {
  constructor(
    @InjectRepository() private pendingRepository: PendingRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.pendingRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(PendingId: number, resourceOptions?: object) {
    return await this.getRequestedPendingOrFail(PendingId, resourceOptions);
  }

  public async create(data: object) {
    let pending = await this.pendingRepository.createPending(data);

    this.eventDispatcher.dispatch('onPendingCreate', pending);

    return pending;
  }

  public async updateOneById(id: number, data: object) {
    const pending = await this.getRequestedPendingOrFail(id);

    return await this.pendingRepository.updatePending(pending, data);
  }

  public async deleteOneById(id: number) {
    return await this.pendingRepository.delete(id);
  }

  private async getRequestedPendingOrFail(PendingId: number, resourceOptions?: object) {
    let pending = await this.pendingRepository.getOneById(PendingId, resourceOptions);

    if (!pending) {
      throw new CategoryNotFoundException();
    }

    return pending;
  }
}
