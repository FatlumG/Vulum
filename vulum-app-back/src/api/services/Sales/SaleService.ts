import { Service } from 'typedi';
import { SaleRepository } from '@api/repositories/Sales/SaleRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class SaleService {
  constructor(@InjectRepository() private saleRepository: SaleRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.saleRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedSaleOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let sale = await this.saleRepository.createSale(data);

    this.eventDispatcher.dispatch('onSaleCreate', sale);

    return sale;
  }

  public async updateOneById(id: number, data: object) {
    const sale = await this.getRequestedSaleOrFail(id);

    return await this.saleRepository.updateSale(sale, data);
  }

  public async deleteOneById(id: number) {
    return await this.saleRepository.delete(id);
  }

  private async getRequestedSaleOrFail(id: number, resourceOptions?: object) {
    let sale = await this.saleRepository.getOneById(id, resourceOptions);

    if (!sale) {
      throw new CategoryNotFoundException();
    }

    return sale;
  }
}
