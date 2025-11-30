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
      where: { status: 'available' },
      ...resourceOptions,
      relations: ['productImages'],
      order: { id: 'DESC' },
    });
  }

  public async getPendingProducts(resourceOptions?: object) {
    return await this.productRepository.find({
      where: { status: 'pending' },
      ...resourceOptions,
      relations: ['productImages'],
      order: { id: 'DESC' },
    });
  }
  public async getUnavailableProducts(resourceOptions?: object) {
    return await this.productRepository.find({
      where: { status: 'unavailable' },
      ...resourceOptions,
      relations: ['productImages'],
      order: { id: 'DESC' },
    });
  }

  public async getSoldProducts(resourceOptions?: object) {
    return await this.productRepository.find({ where: { Status: 'sold' }, ...resourceOptions });
  }

  public async findOneById(id: number) {
    // const product = await this.productRepository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.productImages', 'productImages')
    //   .leftJoinAndSelect('product.category', 'category')
    //   .select([
    //     'product.id',
    //     'product.product_name',
    //     'product.product_description',
    //     'product.price',
    //     'product.stock',
    //     'category.id',
    //     'category.category_name',
    //     'productImages.image_url',
    //   ])
    //   .where('product.id = :id', { id })
    //   .getOne();

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id })
      .getOne();

    return product;
  }

  public async getMyProducts(user: LoggedUserInterface) {
    return await this.productRepository.find({ where: { created_by: user.userId }, relations: ['productImages'], order: { created_at: 'DESC' } });
  }

  public async create(data: ProductCreateRequest, loggedUser: LoggedUserInterface) {
    console.log('creating product..');

    const user = await this.userRepository.findOne(loggedUser.userId);

    const productItem = await stripe.products.create({
      name: data.product_name,
      description: data.product_description,
    });

    console.log(data.product_name, data.product_description);

    console.log(productItem, 'productItem');

    const price = await stripe.prices.create({
      unit_amount: Math.round(data.price * 100),
      currency: 'usd',
      product: productItem.id,
    });

    console.log(price, 'price');

    const planWithStripe = {
      ...data,
      stripe_product_id: productItem.id,
      stripe_price_id: price.id,
      created_by: loggedUser.userId,
    };

    console.log(planWithStripe, 'planWithStripe');

    user.products += 1;

    await this.userRepository.save(user);

    let product = await this.productRepository.createproduct(planWithStripe);
    this.eventDispatcher.dispatch('onProductCreate', product);

    return product;
  }

  public async updateOneById(id: number, data: object) {
    const product = await this.getRequestedProductOrFail(id);

    return await this.productRepository.updateproduct(product, data);
  }

  public async updateStatusById(id: number, status: ProductStatus) {
    await this.productRepository.update(id, { status: status });
    return { message: `Status updated to ${status}` };
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
      const searchFields = ['product_name', 'product_description'];

      const orConditions = searchFields.map((field) => {
        return `${field} LIKE :search`;
      });

      const whereClause = `(${orConditions.join(' OR ')})`;
      const searchValue = `%${search}%`;

      queryBuilder.andWhere(whereClause, { search: searchValue });
    }

    queryBuilder.select([
      'Product.id',
      'Product.product_name',
      'Product.product_description',
      'Product.price',
      'Product.stock',
      'Product.category',
      'Product.created_at',
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
