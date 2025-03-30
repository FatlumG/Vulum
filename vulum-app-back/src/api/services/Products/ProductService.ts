import { Service } from 'typedi';
import { ProductRepository } from '@api/repositories/Products/ProductRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class ProductService {
  constructor(
    @InjectRepository() private productRepository: ProductRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.productRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedProductOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let product = await this.productRepository.createproduct(data);

    this.eventDispatcher.dispatch('onProductCreate', product);

    return product;
  }

  public async updateOneById(id: number, data: object) {
    const product = await this.getRequestedProductOrFail(id);

    return await this.productRepository.updateproduct(product, data);
  }

  public async deleteOneById(id: number) {
    return await this.productRepository.delete(id);
  }

  private async getRequestedProductOrFail(id: number, resourceOptions?: object) {
    let product = await this.productRepository.getOneById(id, resourceOptions);

    if (!product) {
      throw new CategoryNotFoundException();
    }

    return product;
  }

  public async getProductsBySearch(search: string) {
    const isSearchEmpty = !search || search.trim() === ',';

    const queryBuilder = this.productRepository.createQueryBuilder('Product');

    if (!isSearchEmpty) {
      const searchFields = ['ProductName', 'ProductDescription'];

      const orConditions = searchFields.map((field) => {
        return `${field} LIKE :search`;
      });

      const whereClause = `(${orConditions.join(' OR ')})`;
      const searchValue = `%${search}%`;

      queryBuilder.andWhere(whereClause, { search: searchValue });
    }

    queryBuilder.select([
      'Product.id',
      'Product.ProductName',
      'Product.ProductDescription',
      'Product.Price',
      'Product.Stock',
      'Product.Category',
      'Product.CreatedAt',
    ]);

    const products = await queryBuilder.getMany();

    if (!products) {
      throw new CategoryNotFoundException();
    }
    return products;
  }
}
