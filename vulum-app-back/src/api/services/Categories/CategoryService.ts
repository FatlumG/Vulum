import { Service } from 'typedi';
import { CategoryRepository } from '@api/repositories/Categories/CategoryRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class CategoryService {
  constructor(
    @InjectRepository() private categoryRepository: CategoryRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.categoryRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedCategoryOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let category = await this.categoryRepository.createCategory(data);

    this.eventDispatcher.dispatch('onCategoryCreate', category);

    return category;
  }

  public async updateOneById(id: number, data: object) {
    const category = await this.getRequestedCategoryOrFail(id);

    return await this.categoryRepository.updateCategory(category, data);
  }

  public async deleteOneById(id: number) {
    return await this.categoryRepository.delete(id);
  }

  private async getRequestedCategoryOrFail(id: number, resourceOptions?: object) {
    let category = await this.categoryRepository.getOneById(id, resourceOptions);

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return category;
  }
}
