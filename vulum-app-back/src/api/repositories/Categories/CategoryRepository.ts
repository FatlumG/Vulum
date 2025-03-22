import { Category } from '@api/models/Categories/Category';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Category)
export class CategoryRepository extends RepositoryBase<Category> {
  public async createCategory(data: object) {
    let entity = new Category();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateCategory(category: Category, data: object) {
    Object.assign(category, data);

    return await category.save(data);
  }
}
