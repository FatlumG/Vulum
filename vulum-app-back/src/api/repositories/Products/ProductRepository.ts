import { Product } from '@api/models/Products/Product';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Product)
export class ProductRepository extends RepositoryBase<Product> {
  public async createproduct(data: object) {
    let entity = new Product();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateproduct(product: Product, data: object) {
    Object.assign(product, data);

    return await product.save(data);
  }
}
