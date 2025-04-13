import { Service } from 'typedi';
import { PendingRepository } from '@api/repositories/Pendings/PendingRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';

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

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedPendingOrFail(id, resourceOptions);
  }

  public async create(data: object, loggedUser: LoggedUserInterface) {
    const newProduct = {
      ...data,
      UserId: { id: loggedUser.id },
    };

    let pending = await this.pendingRepository.createPending(newProduct);

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

  private async getRequestedPendingOrFail(id: number, resourceOptions?: object) {
    let pending = await this.pendingRepository.getOneById(id, resourceOptions);

    if (!pending) {
      throw new CategoryNotFoundException();
    }

    return pending;
  }
}
