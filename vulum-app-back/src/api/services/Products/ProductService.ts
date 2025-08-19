import { Service } from 'typedi';
import { ProductRepository } from '@api/repositories/Products/ProductRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductCreateRequest } from '@base/api/requests/Products/ProductCreateRequest';
import { ProductStatus } from '@api/models/Products/PEnum';
import stripe from '@base/config/stripe';

@Service()
export class ProductService {
  constructor(
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getAll(resourceOptions?: object) {
    return await this.productRepository.findAndCount({
      ...resourceOptions,
      relations: ['productImages'],
    });
  }

  public async getAvailableProducts(resourceOptions?: object) {
    return await this.productRepository.find({
      where: { Status: 'available' },
      ...resourceOptions,
      relations: ['productImages'],
      order: { id: 'DESC' },
    });
  }

  public async getPendingProducts(resourceOptions?: object) {
    return await this.productRepository.find({
      where: { Status: 'pending' },
      ...resourceOptions,
      relations: ['productImages'],
      order: { id: 'DESC' },
    });
  }

  public async getSoldProducts(resourceOptions?: object) {
    return await this.productRepository.find({ where: { Status: 'sold' }, ...resourceOptions });
  }

  public async findOneById(id: number) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.ProductName',
        'product.ProductDescription',
        'product.Price',
        'product.Stock',
        'category.CategoryName',
        'productImages.image_url',
      ])
      .where('product.id = :id', { id })
      .getOne();

    return product;
  }

  public async getMyProducts(user: LoggedUserInterface) {
    return await this.productRepository.find({ where: { CreatedBy: user.userId }, relations: ['productImages'], order: { CreatedAt: 'DESC' } });
  }

  public async create(data: ProductCreateRequest, loggedUser: LoggedUserInterface) {
    const user = await this.userRepository.findOne(loggedUser.userId);

    const productItem = await stripe.products.create({
      name: data.ProductName,
      description: data.ProductDescription,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(data.Price * 100),
      currency: 'usd',
      product: productItem.id,
    });

    const planWithStripe = {
      ...data,
      StripeProductId: productItem.id,
      StripePriceId: price.id,
      CreatedBy: loggedUser.userId,
    };

    user.Products += 1;

    await this.userRepository.save(user);

    let product = await this.productRepository.createproduct(planWithStripe);
    this.eventDispatcher.dispatch('onProductCreate', product);

    return product;
  }

  public async updateOneById(id: number, data: object) {
    const product = await this.getRequestedProductOrFail(id);

    return await this.productRepository.updateproduct(product, data);
  }

  public async updateStatusById(id: number) {
    await this.productRepository.update(id, { Status: ProductStatus.AVAILABLE });
    return { message: 'Status updated to AVAILABLE' };
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

  public async countProductsForUser(userId: number) {
    return await this.productRepository.count({ where: { CreatedBy: userId } });
  }
}
