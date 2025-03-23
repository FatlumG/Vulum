import { Service } from 'typedi';
import { PlanRepository } from '@api/repositories/Plans/PlanRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class PlanService {
  constructor(@InjectRepository() private planRepository: PlanRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.planRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedPlanOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let plan = await this.planRepository.createPlan(data);

    this.eventDispatcher.dispatch('onPlanCreate', plan);

    return plan;
  }

  public async updateOneById(id: number, data: object) {
    const plan = await this.getRequestedPlanOrFail(id);

    return await this.planRepository.updatePlan(plan, data);
  }

  public async deleteOneById(id: number) {
    return await this.planRepository.delete(id);
  }

  private async getRequestedPlanOrFail(id: number, resourceOptions?: object) {
    let plan = await this.planRepository.getOneById(id, resourceOptions);

    if (!plan) {
      throw new CategoryNotFoundException();
    }

    return plan;
  }
}
