import { Service } from 'typedi';
import { PlanRepository } from '@api/repositories/Plans/PlanRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanCreateRequest } from '@base/api/requests/Plans/PlanCreateRequest';
import { BillingCycle } from '@base/api/models/Plans/PEnum';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import stripe from '@base/config/stripe';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { User } from '@base/api/models/Users/User';

@Service()
export class PlanService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
    @InjectRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.planRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedPlanOrFail(id, resourceOptions);
  }

  public async create(data: PlanCreateRequest) {
    const product = await stripe.products.create({
      name: data.PlanName,
      description: data.PlanDescription,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(data.Price * 100),
      currency: 'usd',
      recurring: {
        interval: data.BillingCycle === BillingCycle.MONTHLY ? 'month' : 'year',
      },
      product: product.id,
    });

    const planWithStripe = {
      ...data,
      StripeProductId: product.id,
      StripePriceId: price.id,
    };
    let plan = await this.planRepository.createPlan(planWithStripe);
    this.eventDispatcher.dispatch('onPlanCreate', plan);
    return plan;
  }

  public async createCheckoutSession(planId: number, user: LoggedUserInterface) {
    const plan = await this.planRepository.findOne(planId);
    if (!plan || !plan.StripePriceId) {
      throw new Error('Plan or Stripe price not found');
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan.BillingCycle === 'none' ? 'payment' : 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: plan.StripePriceId,
          quantity: 1,
        },
      ],
      // success?session_id={CHECKOUT_SESSION_ID}
      success_url: 'http://localhost:3000/docs/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: { userId: user.userId, planId },
    });
    return { url: session.url };
  }

  public async updateOneById(id: number, data: object) {
    const plan = await this.getRequestedPlanOrFail(id);

    return await this.planRepository.updatePlan(plan, data);
  }

  public async deleteOneById(id: number) {
    return await this.planRepository.delete(id);
  }

  public async getMyPlan(user: LoggedUserInterface) {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.userId },
      relations: ['PricingPlan'],
    });

    return fullUser?.PricingPlan ?? null;
  }

  private async getRequestedPlanOrFail(id: number, resourceOptions?: object) {
    let plan = await this.planRepository.getOneById(id, resourceOptions);

    if (!plan) {
      throw new CategoryNotFoundException();
    }

    return plan;
  }
}
