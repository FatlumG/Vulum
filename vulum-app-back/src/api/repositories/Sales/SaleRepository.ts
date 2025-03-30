import { Sale } from '@api/models/Sales/Sale';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Sale)
export class SaleRepository extends RepositoryBase<Sale> {
  public async createSale(data: object) {
    let entity = new Sale();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateSale(Sale: Sale, data: object) {
    Object.assign(Sale, data);

    return await Sale.save(data);
  }
}
