import { Plan } from '@api/models/Plans/Plan';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Plan)
export class PlanRepository extends RepositoryBase<Plan> {
  public async createPlan(data: object) {
    let entity = new Plan();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updatePlan(Plan: Plan, data: object) { //ts disable line
    Object.assign(Plan, data);

    return await Plan.save(data);
  }
}
