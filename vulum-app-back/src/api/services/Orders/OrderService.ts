import { Service } from 'typedi';
import { OrderRepository } from '@api/repositories/Orders/OrderRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductRepository } from '@base/api/repositories/Products/ProductRepository';
import { OrderItemRepository } from '@base/api/repositories/OrderItems/OrderItemRepository';
import stripe from '@base/config/stripe';

@Service()
export class OrderService {
  constructor(
    @InjectRepository() private orderRepository: OrderRepository,
    @InjectRepository() private orderItemRepository: OrderItemRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.orderRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedOrderOrFail(id, resourceOptions);
  }

  public async createCheckoutSession(data: { items: { product_id: number; quantity: number }[] }, user: LoggedUserInterface) {
    const items = data.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('No items provided for the order.');
    }

    const productIds = items.map((item) => item.product_id);
    const products = await this.productRepository.findByIds(productIds);

    console.log('Incoming items:', data.items);
    console.log('Product IDs:', productIds);
    console.log('Found products:', products);

    if (products.length !== productIds.length) {
      throw new Error('One or more products not found.');
    }

    let totalAmount = 0;
    const stripeLineItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        throw new Error(`Product with id ${item.product_id} not found.`);
      }
      if (product.CreatedBy === user.userId) {
        throw new Error(`You cannot buy your own product.`);
      }
      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for ${product.ProductName}.`);
      }

      totalAmount += product.Price * item.quantity;

      if (!product.StripePriceId) {
        throw new Error(`Stripe Price ID missing for product ${product.ProductName}.`);
      }
      if (product.Stock < item?.quantity) {
        throw new Error(`Not enough stock for ${product.ProductName}.`);
      }

      stripeLineItems.push({
        price: product.StripePriceId,
        quantity: item.quantity || 1,
      });
    }

    const order = await this.orderRepository.createOrder({
      name: `Order-${Date.now()}`,
      amount: totalAmount,
      status: 'pending',
      created_by: user.userId,
    });

    for (const item of items) {
      await this.orderItemRepository.createOrderItem({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_amount: products.find((p) => p.id === item.product_id).Price * item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: stripeLineItems,
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: 'http://localhost:3000/cancel',
      metadata: {
        userId: user.userId,
        orderId: order.id,
        productId: productIds.join(','),
      },
    });

    return { url: session.url };
  }

  public async updateOneById(id: number, data: object) {
    const order = await this.getRequestedOrderOrFail(id);

    return await this.orderRepository.updateOrder(order, data);
  }

  public async deleteOneById(id: number) {
    return await this.orderRepository.delete(id);
  }

  private async getRequestedOrderOrFail(id: number, resourceOptions?: object) {
    let order = await this.orderRepository.getOneById(id, resourceOptions);

    if (!order) {
      throw new CategoryNotFoundException();
    }

    return order;
  }
}
