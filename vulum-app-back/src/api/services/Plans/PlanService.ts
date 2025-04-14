import { Service } from 'typedi';
import { PlanRepository } from '@api/repositories/Plans/PlanRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanCreateRequest } from '@base/api/requests/Plans/PlanCreateRequest';
import { BillingCycle } from '@base/api/models/Plans/PEnum';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import Stripe from 'stripe';
import stripe from '@base/config/stripe';

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
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return { url: session.url };
  }

  public async handleWebhook(req: any, res: any) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      // Construct the event with the signature verification
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on its type
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const email = session.customer_email;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;

        const user = await this.userRepository.findOne(email);
        const plan = await this.planRepository.findOne(priceId);

        if (user && plan) {
          user.PricingPlan = plan.id;
          await this.userRepository.save(user);
          console.log(`Assigned plan "${plan.PlanName}" to user "${user.Email}"`);
        } else {
          console.warn(`User or plan not found for email ${email} and priceId ${priceId}`);
        }
      } catch (err) {
        console.error('Error processing webhook:', err.message);
        return res.status(500).send('Webhook processing failed');
      }
    }

    // Return success response to Stripe
    res.status(200).send('Webhook received');
  }

  public async updateOneById(id: number, data: object) {
    const plan = await this.getRequestedPlanOrFail(id);

    return await this.planRepository.updatePlan(plan, data);
  }

  public async deleteOneById(id: number) {
    return await this.planRepository.delete(id);
  }

  private async getRequestedPlanOrFail(id: number, resourceOptions?: object) {
    let plan = await this.planRepository.getOneById(id, resourceOptions);

    if (!plan) {
      throw new CategoryNotFoundException();
    }

    return plan;
  }
}
