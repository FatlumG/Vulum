import { Service } from 'typedi';
import { ProductRepository } from '@api/repositories/Products/ProductRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductCreateRequest } from '@base/api/requests/Products/ProductCreateRequest';
import stripe from '@base/config/stripe';

@Service()
export class ProductService {
  constructor(
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.productRepository.getManyAndCount(resourceOptions);
  }

  public async getAvailableProducts(resourceOptions?: object) {
    return await this.productRepository.find({ where: { Status: 'available' }, ...resourceOptions });
  }

  public async getPendingProducts(resourceOptions?: object) {
    return await this.productRepository.find({ where: { Status: 'pending' }, ...resourceOptions });
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedProductOrFail(id, resourceOptions);
  }

  public async getMyProducts(user: LoggedUserInterface, resourceOptions?: object) {
    return await this.productRepository.find({ where: { CreatedBy: user.userId }, ...resourceOptions });
  }

  public async create(data: ProductCreateRequest, loggedUser: LoggedUserInterface) {
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

    let product = await this.productRepository.createproduct(planWithStripe);
    this.eventDispatcher.dispatch('onProductCreate', product);
    return productItem;
  }

  // public async createCheckoutSession(productId: number, user: any) {
  //   const product = await this.productRepository.findOne(productId);
  //   if (!product || !product.StripePriceId) {
  //     throw new Error('Product or Stripe price not found');
  //   }
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     mode: 'payment',
  //     customer_email: user.email,
  //     line_items: [
  //       {
  //         price: product.StripePriceId,
  //         quantity: 1,
  //       },
  //     ],
  //     success_url: 'http://localhost:3000/docs/?session_id={CHECKOUT_SESSION_ID}',
  //     cancel_url: 'http://localhost:3000/cancel',
  //     metadata: { userId: user.id, productId },
  //   });

  //   return { url: session.url };
  // }

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

  public async countProductsForUser(userId: number) {
    return await this.productRepository.count({ where: { CreatedBy: userId } });
  }
}
