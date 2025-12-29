import 'reflect-metadata';
import { fixModuleAlias } from './utils/fix-module-alias';
fixModuleAlias(__dirname);
import { appConfig } from '@base/config/app';
import { loadEventDispatcher } from '@base/utils/load-event-dispatcher';
import { useContainer as routingControllersUseContainer, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { loadHelmet } from '@base/utils/load-helmet';
import { Container } from 'typedi';
import { createConnection, In, useContainer as typeormOrmUseContainer } from 'typeorm';
import { Container as containerTypeorm } from 'typeorm-typedi-extensions';
import { useSocketServer, useContainer as socketUseContainer } from 'socket-controllers';
import { registerController as registerCronJobs, useContainer as cronUseContainer } from 'cron-decorators';
import * as path from 'path';
import express from 'express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import { buildSchema } from 'type-graphql';
import bodyParser from 'body-parser';
import cors from 'cors';
import stripe from './config/stripe';
import { Plan } from './api/models/Plans/Plan';
import { User } from './api/models/Users/User';
import { Product } from './api/models/Products/Product';
import { Order } from './api/models/Orders/Order';
import { Sale } from './api/models/Sales/Sale';
import { Invoice } from './api/models/Invoices/Invoice';
import { getRepository, getManager } from 'typeorm';
import Stripe from 'stripe';
import { generateInvoicePdf } from './utils/pdf-generator';
import { OrderStatus } from './api/models/Orders/OEnum';
import { ProductStatus } from './api/models/Products/PEnum';
import { UserSubscription } from './api/models/Subscriptions/UserSubscription';

export class App {
  private app: express.Application = express();
  private port: Number = appConfig.port;

  public constructor() {
    this.bootstrap();
  }

  public async bootstrap() {
    this.useContainers();
    await this.typeOrmCreateConnection();
    this.registerEvents();
    this.registerCronJobs();
    this.serveStaticFiles();
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
      }),
    );
    // this.app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    //   const sig = req.headers['stripe-signature'];
    //   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    //   let event;

    //   try {
    //     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    //     // console.log(event.data.object, 'event.data.object');
    //   } catch (err) {
    //     return res.status(400).send(`Webhook Error: ${err.message}`);
    //   }

    //   try {
    //     const eventType = event.type;
    //     const session = event.data.object as Stripe.Checkout.Session;
    //     console.log(`Received event: ${eventType}`);

    //     switch (eventType) {
    //       case 'checkout.session.completed':
    //         if (!session.metadata) {
    //           console.log('No metadata found');
    //           return res.status(400).send('No metadata found');
    //         }

    //         const { userId, planId, orderId, productId: productIdsRaw } = session.metadata;

    //         if (!userId || (!planId && !orderId)) {
    //           console.log('Missing required metadata fields');
    //           console.log({ userId, planId, orderId });
    //           return res.status(400).send('Missing required metadata fields');
    //         }

    //         const userRepository = getRepository(User);
    //         const user = await userRepository.findOne({
    //           where: { id: userId },
    //           relations: ['pricing_plan'],
    //         });

    //         if (!user) return res.status(400).send('User not found');

    //         if (planId) {
    //           const planRepository = getRepository(Plan);
    //           const plan: Plan = await planRepository.findOne({ where: { id: planId } });
    //           if (!plan) return res.status(400).send('Plan not found');

    //           // console.log(user, 'user');
    //           // console.log(plan, 'plan');
    //           const subscriptionRepository = getRepository(UserSubscription);

    //           if (!session.subscription) {
    //             throw new Error('No subscription ID found in session.');
    //           }

    //           const stripeSubscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as Stripe.Subscription;
    //           const subscriptionItem = stripeSubscription.items.data[0];
    //           const current_period_end = new Date(subscriptionItem.current_period_end * 1000).toISOString();

    //           const start_date =
    //             typeof stripeSubscription.start_date === 'number' && stripeSubscription.start_date > 0
    //               ? new Date(stripeSubscription.start_date * 1000).toISOString()
    //               : null;

    //           const trial_ends_at =
    //             typeof stripeSubscription.trial_end === 'number' && stripeSubscription.trial_end > 0
    //               ? new Date(stripeSubscription.trial_end * 1000).toISOString()
    //               : null;

    //           const subscriptionData = {
    //             user_id: user.id,
    //             plan_id: plan.id,
    //             stripe_subscription_id: stripeSubscription.id,
    //             status: stripeSubscription.status,
    //             start_date,
    //             current_period_end,
    //             trial_ends_at,
    //             cancel_at_period_end: stripeSubscription.cancel_at_period_end || false,
    //           };

    //           const subscription = subscriptionRepository.create(subscriptionData);
    //           await subscriptionRepository.save(subscription);

    //           console.log(subscriptionData, 'subscriptionData');

    //           user.pricing_plan = plan;
    //           await userRepository.save(user);

    //           console.log('User plan updated from checkout.session.completed');
    //           return res.status(200).send('Plan updated');
    //         }

    //         if (orderId) {
    //           const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

    //           const products: any[] = [];
    //           const productRepository = getRepository(Product);
    //           const orderRepository = getRepository(Order);
    //           const saleRepository = getRepository(Sale);

    //           if (productIdsRaw) {
    //             const productIds = productIdsRaw
    //               .split(',')
    //               .map((id) => Number(id.trim()))
    //               .filter((id) => !isNaN(id));

    //             for (let i = 0; i < productIds.length; i++) {
    //               const id = productIds[i];
    //               const item = lineItems.data[i];

    //               const product = await productRepository.findOne({ where: { id } });

    //               if (!product) {
    //                 console.warn(`⚠️ Product not found for ID: ${id}`);
    //                 continue;
    //               }
    //               product.stock -= item?.quantity ?? 1;
    //               product.status = ProductStatus.SOLD;
    //               await productRepository.save(product);

    //               if (!product.price || !product.created_by || !orderId) {
    //                 throw new Error('Missing product data or orderId');
    //               }

    //               const sale = new Sale();
    //               const prodOwner = await userRepository.findOne({ where: { id: product.created_by } });

    //               sale.order_id = Number(orderId);
    //               sale.total_price = product.price;
    //               sale.user_id = product.created_by;
    //               await saleRepository.save(sale);

    //               prodOwner.sales += 1;
    //               await userRepository.save(prodOwner);
    //               products.push({
    //                 product,
    //                 quantity: item?.quantity ?? 1,
    //               });
    //             }
    //           }

    //           const order = await orderRepository.findOne({ where: { id: orderId } });
    //           order.status = OrderStatus.CONFIRMED;
    //           user.orders += 1;

    //           generateInvoicePdf({
    //             customerName: user.username,
    //             customerAddress: user.address,
    //             items: products.map((p) => ({
    //               description: p.product.product_name,
    //               quantity: p.quantity,
    //               price: p.product.price,
    //             })),
    //             stripePaymentId: String(session.payment_intent),
    //             paymentDate: String(new Date()),
    //             currency: 'USD',
    //           });

    //           const invoiceIdRaw = session.metadata?.invoiceId;

    //           if (!invoiceIdRaw || isNaN(parseInt(invoiceIdRaw))) {
    //             console.error('Invalid invoiceId in metadata:', invoiceIdRaw);
    //             return res.status(400).send('Invalid invoiceId in metadata');
    //           }

    //           const invoiceId = parseInt(invoiceIdRaw);

    //           const invoiceRepository = getRepository(Invoice);

    //           const invoice = await invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['order'] });
    //           if (!invoice) throw new Error('Invoice not found');

    //           invoice.status = 'paid';
    //           invoice.stripe_invoice_id = session.payment_intent?.toString();
    //           invoice.stripe_customer_id = session.customer?.toString();
    //           await invoiceRepository.save(invoice);

    //           if (invoice.order) {
    //             invoice.order.status = OrderStatus.APPROVED;
    //             await invoiceRepository.save(invoice.order);
    //           } else {
    //             console.warn(`Invoice ${invoiceId} has no associated order.`);
    //           }
    //           // invoice.order.status = OrderStatus.APPROVED;

    //           // console.log(invoice);
    //           // await invoiceRepository.save(invoice.order);

    //           await userRepository.save(user);
    //           await orderRepository.save(order);
    //           return res.status(200).send('Order incremented');
    //         }

    //         return res.status(400).send('No valid metadata found');
    //       // case 'invoice.payment_succeeded':
    //       //   const invoice = event.data.object as Stripe.Invoice;
    //       //   console.log('Invoice payment succeeded:', invoice);
    //       //   return res.status(200).send('Invoice handled');
    //       case 'invoice.created':
    //         const stripeInvoice = event.data.object as Stripe.Invoice;
    //         const invoiceIdRaw = stripeInvoice.metadata?.invoiceId;
    //         // const invoiceIdRaw = session.metadata.invoiceId;

    //         // if (!invoiceIdRaw) {
    //         //   throw new Error('Invoice ID metadata is missing from the session.');
    //         // }

    //         // const invoiceId = parseInt(invoiceIdRaw);

    //         // if (isNaN(invoiceId) || invoiceId <= 0) {
    //         //   // This logs the bad data, which is crucial for debugging
    //         //   console.error(`Invalid invoiceId value in metadata: ${invoiceIdRaw}`);
    //         //   throw new Error(`Invalid invoice ID: ${invoiceIdRaw}. Cannot find invoice.`);
    //         // }

    //         // const invoiceRepository = getRepository(Invoice);
    //         // const invoice = await invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['order'] });
    //         // invoice.status = 'created';
    //         // await invoiceRepository.save(invoice);
    //         break;
    //       case 'invoice.finalized':
    //         // invoice.status = 'finalized';
    //         // await invoiceRepository.save(invoice);
    //         break;
    //       case 'invoice.paid':
    //         // invoice.status = 'paid';
    //         // await invoiceRepository.save(invoice);
    //         break;
    //       case 'invoice.payment_succeeded': {
    //         // const invoice = event.data.object as Stripe.Invoice;

    //         // Safely parse date fields, if any
    //         // const periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null;
    //         // const periodStart = invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null;

    //         // You can add your logic here to update invoice status in DB or send notifications
    //         // console.log(`Invoice event: ${event.type}, Invoice ID: ${invoice.id}`);
    //         // console.log('Period start:', periodStart);
    //         // console.log('Period end:', periodEnd);

    //         return res.status(200).send(`Handled ${event.type}`);
    //       }
    //       case 'payment_intent.created': {
    //         const paymentIntent = event.data.object as Stripe.PaymentIntent;
    //         console.log('Payment Intent created:', paymentIntent.id);
    //         // Optional: update DB or notify user here
    //         return res.status(200).send('Payment Intent created handled');
    //       }
    //       //needs to be fixed
    //       case 'invoice.payment_failed': {
    //         const invoice = event.data.object as any;
    //         // Stripe.Invoice
    //         console.log('Invoice payment failed:', invoice);

    //         // Example: update subscription status to 'past_due' in your DB
    //         const subscriptionRepository = getRepository(UserSubscription);
    //         const subscription = await subscriptionRepository.findOne({
    //           where: { stripe_subscription_id: invoice.subscription as string },
    //         });
    //         if (subscription) {
    //           subscription.status = 'past_due';
    //           await subscriptionRepository.save(subscription);
    //           console.log(`Subscription ${subscription.id} marked as past_due.`);
    //         }

    //         // TODO: Notify user by email or other means

    //         return res.status(200).send('Invoice payment failed handled');
    //       }
    //       case 'customer.subscription.created':
    //         const subscription = event.data.object as Stripe.Subscription;
    //         console.log('Customer subscription created:', subscription);
    //         return res.status(200).send('Subscription handled');
    //       //needs to be fixed
    //       case 'customer.subscription.updated': {
    //         const subscription = event.data.object as Stripe.Subscription;
    //         console.log('Subscription updated:', subscription);

    //         const subscriptionRepository = getRepository(UserSubscription);
    //         const existingSub = await subscriptionRepository.findOne({
    //           where: { stripe_subscription_id: subscription.id },
    //         });

    //         //@ts-ignore
    //         // const currentPeriodEndTimestamp = stripeSubscription.current_period_end;
    //         // if (!currentPeriodEndTimestamp) {
    //         //   throw new Error('Stripe subscription missing current_period_end');
    //         // }
    //         // const current_period_end = new Date(currentPeriodEndTimestamp * 1000).toISOString();

    //         // if (existingSub) {
    //         //   existingSub.status = subscription.status;
    //         //   existingSub.current_period_end = current_period_end;
    //         //   existingSub.cancel_at_period_end = subscription.cancel_at_period_end;
    //         //   existingSub.trial_ends_at = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;
    //         //   await subscriptionRepository.save(existingSub);
    //         //   console.log(`Subscription ${existingSub.id} updated.`);
    //         // }

    //         // return res.status(200).send('Subscription updated handled');
    //         const currentPeriodEndTimestamp = stripeSubscription.current_period_end;
    //         if (!currentPeriodEndTimestamp || isNaN(currentPeriodEndTimestamp)) {
    //           throw new Error('Stripe subscription missing or invalid current_period_end');
    //         }
    //         const current_period_end = new Date(currentPeriodEndTimestamp * 1000).toISOString();

    //         if (existingSub) {
    //           existingSub.status = subscription.status;

    //           existingSub.current_period_end = current_period_end;

    //           existingSub.cancel_at_period_end = !!subscription.cancel_at_period_end;

    //           if (subscription.trial_end && !isNaN(subscription.trial_end)) {
    //             existingSub.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
    //           } else {
    //             existingSub.trial_ends_at = null;
    //           }

    //           await subscriptionRepository.save(existingSub);
    //           console.log(`Subscription ${existingSub.id} updated.`);
    //         }

    //         return res.status(200).send('Subscription update handled');
    //       }
    //       //needs to be fixed
    //       case 'customer.subscription.deleted': {
    //         const subscription = event.data.object as Stripe.Subscription;
    //         console.log('Subscription deleted:', subscription);

    //         const subscriptionRepository = getRepository(UserSubscription);
    //         const existingSub = await subscriptionRepository.findOne({
    //           where: { stripe_subscription_id: subscription.id },
    //         });

    //         if (existingSub) {
    //           existingSub.status = 'canceled';
    //           await subscriptionRepository.save(existingSub);
    //           console.log(`Subscription ${existingSub.id} marked as canceled.`);
    //         }

    //         return res.status(200).send('Subscription deleted handled');
    //       }
    //       case 'charge.updated':
    //         const charge = event.data.object as Stripe.Charge;
    //         console.log('Charge updated:', charge);
    //         return res.status(200).send('Charge handled');

    //       case 'charge.succeeded':
    //         const succeededCharge = event.data.object as Stripe.Charge;
    //         console.log('Charge succeeded:', succeededCharge);
    //         return res.status(200).send('Charge handled');

    //       default:
    //         console.log(`Unhandled event type: ${eventType}`);
    //         return res.status(200).send('Unhandled event type');
    //     }
    //   } catch (err) {
    //     console.error('Webhook handler failed:', err.message);
    //     return res.status(500).send(`Internal error: ${err.message}`);
    //   }
    // });
    // put this in your main.ts (replace existing webhook route)
    // requires: express, stripe (initialized), typeorm imports (getRepository, getManager), and your Entities

    this.app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
      const sig = req.headers['stripe-signature'] as string | undefined;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event: Stripe.Event;

      // 1) Validate signature and event
      try {
        if (!sig || !endpointSecret) {
          console.error('Missing stripe signature or endpoint secret');
          return res.status(400).send('Webhook config error');
        }
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error('Stripe webhook signature verification failed:', err?.message);
        return res.status(400).send(`Webhook Error: ${err?.message}`);
      }

      // 2) Fast response to Stripe: accept and do processing asynchronously.
      //    This prevents Stripe retries caused by long processing.
      res.status(200).json({ received: true });

      // 3) Allowed events — ignore everything else (you can extend this list)
      const allowed = new Set([
        'checkout.session.completed',
        'invoice.created',
        'invoice.finalized',
        'invoice.paid',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'payment_intent.created',
        'charge.updated',
        'charge.succeeded',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
      ]);

      if (!allowed.has(event.type)) {
        console.log('Ignoring event:', event.type);
        return;
      }

      // 4) Process in background (fire-and-forget). errors logged but won't affect Stripe.
      (async () => {
        try {
          const eventType = event.type;
          console.log(`Processing Stripe event: ${eventType}`);

          // CASE : checkout.session.completed  (session object)
          if (eventType === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            // Validate metadata exists and contains the mandatory values
            if (!session.metadata) {
              console.warn('checkout.session.completed missing metadata', session.id);
              return;
            }

            const userIdRaw = session.metadata.userId;
            const orderIdRaw = session.metadata.orderId;
            const invoiceIdRaw = session.metadata.invoiceId;
            const productIdsRaw = session.metadata.productId; // optional

            if (!userIdRaw || (!orderIdRaw && !session.metadata.planId)) {
              console.warn('checkout.session.completed missing required metadata:', session.metadata);
              return;
            }

            const userId = parseInt(String(userIdRaw));
            const orderId = orderIdRaw ? parseInt(String(orderIdRaw)) : null;
            const invoiceId = invoiceIdRaw ? parseInt(String(invoiceIdRaw)) : null;

            if (Number.isNaN(userId) || (orderIdRaw && Number.isNaN(orderId))) {
              console.warn('Invalid numeric metadata in session', session.metadata);
              return;
            }

            const userRepository = getRepository(User);
            const orderRepository = getRepository(Order);
            const productRepository = getRepository(Product);
            const saleRepository = getRepository(Sale);
            const invoiceRepository = getRepository(Invoice);

            // Fetch user (with pricing_plan if needed)
            const user = await userRepository.findOne({ where: { id: userId }, relations: ['pricing_plan'] });
            if (!user) {
              console.warn('User not found for webhook session:', userId);
              return;
            }

            // Handle subscriptions (planId present)
            if (session.metadata.planId) {
              const planRepository = getRepository(Plan);
              const plan = await planRepository.findOne({ where: { id: parseInt(session.metadata.planId) } });
              if (!plan) {
                console.warn('Plan not found for planId:', session.metadata.planId);
                return;
              }

              // ensure there's a subscription id in session
              if (!session.subscription) {
                console.warn('Session missing subscription id', session.id);
                return;
              }

              const stripeSubscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as Stripe.Subscription;
              const subscriptionItem = stripeSubscription.items.data[0];
              const current_period_end = subscriptionItem?.current_period_end
                ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
                : null;

              const start_date =
                typeof stripeSubscription.start_date === 'number' && stripeSubscription.start_date > 0
                  ? new Date(stripeSubscription.start_date * 1000).toISOString()
                  : null;

              const trial_ends_at =
                typeof stripeSubscription.trial_end === 'number' && stripeSubscription.trial_end > 0
                  ? new Date(stripeSubscription.trial_end * 1000).toISOString()
                  : null;

              const subscriptionRepository = getRepository(UserSubscription);
              const subscriptionData = {
                user_id: user.id,
                plan_id: plan.id,
                stripe_subscription_id: stripeSubscription.id,
                status: stripeSubscription.status,
                start_date,
                current_period_end,
                trial_ends_at,
                cancel_at_period_end: stripeSubscription.cancel_at_period_end || false,
              };

              await subscriptionRepository.save(subscriptionData as any);
              user.pricing_plan = plan;
              await userRepository.save(user);
              console.log('Subscription created/updated for user', user.id);
              return;
            }

            // Handle order flow
            if (orderId) {
              // list line items from Stripe (safe: pass session.id)
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

              // products array for invoice PDF, sales, stock update etc
              const products: any[] = [];
              const productIds = productIdsRaw
                ? String(productIdsRaw)
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => !Number.isNaN(n))
                : [];

              // Use transaction for DB updates that must be atomic
              await getManager().transaction(async (manager) => {
                const prodRepoTx = manager.getRepository(Product);
                const saleRepoTx = manager.getRepository(Sale);
                const userRepoTx = manager.getRepository(User);
                const orderRepoTx = manager.getRepository(Order);

                // decrement stock and create sales
                for (let i = 0; i < productIds.length; i++) {
                  const prodId = productIds[i];
                  const item = lineItems.data[i];
                  const product = await prodRepoTx.findOne({ where: { id: prodId } });
                  if (!product) {
                    console.warn(`Product ${prodId} not found (webhook).`);
                    continue;
                  }
                  const qty = item?.quantity ?? 1;
                  product.stock = (product.stock ?? 0) - qty;
                  if (product.stock <= 0) {
                    product.stock = 0;
                    product.status = ProductStatus.SOLD;
                  } else {
                    product.status = ProductStatus.AVAILABLE;
                  }
                  await prodRepoTx.save(product);

                  const sale = new Sale();
                  sale.order_id = Number(orderId);
                  sale.total_price = product.price;
                  sale.user_id = product.created_by;
                  await saleRepoTx.save(sale);

                  const prodOwner = await userRepoTx.findOne({ where: { id: product.created_by } });
                  if (prodOwner) {
                    prodOwner.sales = (prodOwner.sales ?? 0) + 1;
                    await userRepoTx.save(prodOwner);
                  }

                  products.push({ product, quantity: qty });
                }

                // update order status
                const order = await orderRepoTx.findOne({ where: { id: orderId } });
                if (order) {
                  order.status = OrderStatus.CONFIRMED;
                  await orderRepoTx.save(order);
                } else {
                  console.warn('Order not found in webhook for id', orderId);
                }

                // generate invoice PDF (non-blocking; you can run this outside transaction if long)
                try {
                  generateInvoicePdf({
                    customerName: user.username,
                    customerAddress: user.address,
                    items: products.map((p) => ({
                      description: p.product.product_name,
                      quantity: p.quantity,
                      price: p.product.price,
                    })),
                    stripePaymentId: String(session.payment_intent),
                    paymentDate: String(new Date()),
                    currency: 'USD',
                  });
                } catch (pdfErr) {
                  console.warn('Error generating invoice pdf (non-fatal):', pdfErr);
                }
              }); // end transaction

              // Update invoice: find by metadata invoiceId (we expect invoice was created before session)
              if (!invoiceId || Number.isNaN(invoiceId)) {
                console.warn('No valid invoiceId in session metadata; skipping invoice update', session.metadata);
                return;
              }

              const invoiceRepository2 = getRepository(Invoice);
              const invoice = await invoiceRepository2.findOne({ where: { id: invoiceId }, relations: ['order'] });
              if (!invoice) {
                console.warn('Invoice not found for id (webhook):', invoiceId);
                return;
              }

              invoice.status = 'paid';
              // prefer session.payment_intent (actual payment) else session.id
              invoice.stripe_invoice_id = session.payment_intent ? String(session.payment_intent) : session.id;
              invoice.stripe_customer_id = session.customer ? String(session.customer) : invoice.stripe_customer_id || null;
              await invoiceRepository2.save(invoice);

              // update related order to APPROVED if exists
              if (invoice.order) {
                invoice.order.status = OrderStatus.APPROVED;
                await getRepository(Order).save(invoice.order);
              } else {
                console.warn(`Invoice ${invoiceId} has no associated order.`);
              }

              // increment user orders counter safely
              try {
                user.orders = (user.orders ?? 0) + 1;
                await getRepository(User).save(user);
              } catch (uErr) {
                console.warn('Failed to increment user orders (non-fatal):', uErr);
              }

              console.log(`Processed checkout.session.completed for invoice ${invoiceId}`);
              return;
            } // end orderId handling

            // If we reach here, it's an unknown usage of checkout.session.completed
            console.warn('Unhandled checkout.session.completed metadata:', session.metadata);
            return;
          } // end checkout.session.completed

          // CASE: invoice.* events (these contain a Stripe.Invoice object)
          if (eventType.startsWith('invoice.')) {
            const stripeInvoice = event.data.object as Stripe.Invoice;
            const invoiceIdFromMetadata = stripeInvoice.metadata?.invoiceId;
            if (!invoiceIdFromMetadata) {
              // we might want to map stripeInvoice.id to an invoice in DB by stripe_invoice_id if you save that earlier
              console.warn('invoice.* event without invoiceId metadata, skipping. stripe invoice id:', stripeInvoice.id);
              return;
            }

            const invoiceId = parseInt(String(invoiceIdFromMetadata));
            if (Number.isNaN(invoiceId)) {
              console.warn('Invalid invoiceId in stripe invoice metadata:', invoiceIdFromMetadata);
              return;
            }

            const invoiceRepository3 = getRepository(Invoice);
            const invoice = await invoiceRepository3.findOne({ where: { id: invoiceId }, relations: ['order'] });
            if (!invoice) {
              console.warn('Invoice referenced in stripe invoice event not found id=', invoiceId);
              return;
            }

            // map event types to statuses as you prefer
            if (eventType === 'invoice.created') {
              invoice.status = 'created';
            } else if (eventType === 'invoice.finalized') {
              invoice.status = 'finalized';
            } else if (eventType === 'invoice.paid' || eventType === 'invoice.payment_succeeded') {
              invoice.status = 'paid';
            } else if (eventType === 'invoice.payment_failed') {
              invoice.status = 'failed';
            }

            // update stripe ids if present
            invoice.stripe_invoice_id = stripeInvoice.id || invoice.stripe_invoice_id;
            invoice.stripe_customer_id = stripeInvoice.customer ? String(stripeInvoice.customer) : invoice.stripe_customer_id;
            await invoiceRepository3.save(invoice);

            console.log(`Processed ${eventType} for invoice ${invoiceId}`);
            return;
          } // end invoice.* handling

          // CASE: subscription and charge related events (keep read-only logging & small updates if needed)
          if (eventType === 'payment_intent.created') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment Intent created:', paymentIntent.id);
            return;
          }

          if (eventType === 'charge.updated' || eventType === 'charge.succeeded') {
            const charge = event.data.object as Stripe.Charge;
            console.log(`${eventType} event received:`, charge.id);
            return;
          }

          if (eventType.startsWith('customer.subscription')) {
            // keep your existing subscription update logic here — using the subscription object
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Subscription event:', eventType, subscription.id);
            // optionally update local subscription entries
            return;
          }

          // default: ignore safely
          console.warn('Reached default branch for allowed event but no handler implemented:', eventType);
        } catch (err: any) {
          // This catch is inside the background processor: log it.
          console.error('Background webhook processing error:', err?.message || err);
        }
      })(); // end async IIFE

      // Note: We already sent 200 above.
    });

    this.setupMiddlewares();

    this.registerSocketControllers();
    this.registerRoutingControllers();
    this.registerDefaultHomePage();
    this.setupSwagger();
    await this.setupGraphQL();
    // this.register404Page();
  }

  private useContainers() {
    routingControllersUseContainer(Container);
    typeormOrmUseContainer(containerTypeorm);
    socketUseContainer(Container);
    cronUseContainer(Container);
  }

  private async typeOrmCreateConnection() {
    try {
      await createConnection();
    } catch (error) {
      console.log('Caught! Cannot connect to database: ', error);
    }
  }

  private registerEvents() {
    return loadEventDispatcher();
  }

  private registerCronJobs() {
    if (!appConfig.cronJobsEnabled) {
      return false;
    }

    registerCronJobs([__dirname + appConfig.cronJobsDir]);
  }

  private serveStaticFiles() {
    this.app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
  }

  private setupMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    loadHelmet(this.app);
  }

  private registerSocketControllers() {
    const server = require('http').Server(this.app);
    const io = require('socket.io')(server);

    this.app.use(function (req: any, res: any, next) {
      req.io = io;
      next();
    });

    server.listen(this.port, () => console.log(`🚀 Server started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`));

    useSocketServer(io, {
      controllers: [__dirname + appConfig.controllersDir],
    });
  }

  private registerRoutingControllers() {
    useExpressServer(this.app, {
      validation: { stopAtFirstError: true },
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: appConfig.routePrefix,
      controllers: [__dirname + appConfig.controllersDir],
      middlewares: [__dirname + appConfig.middlewaresDir],
    });
  }

  private registerDefaultHomePage() {
    this.app.get('/', (req, res) => {
      res.json({
        title: appConfig.name,
        mode: appConfig.node,
        date: new Date(),
      });
    });
  }

  // private register404Page() {
  //   this.app.get('*', function (req, res) {
  //     res.status(404).send({ status: 404, message: 'Page Not Found!' });
  //   });
  // }

  private setupSwagger() {
    // Parse class-validator classes into JSON Schema
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      { routePrefix: appConfig.routePrefix },
      {
        components: {
          schemas,
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        info: {
          description: 'Welcome to the club!',
          title: 'API Documentation',
          version: '1.0.0',
          contact: {
            name: 'Kutia',
            url: 'https://kutia.net',
            email: 'support@kutia.net',
          },
        },
      },
    );

    // Use Swagger
    this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
  }

  private async setupGraphQL() {
    if (!appConfig.graphqlEnabled) {
      return false;
    }

    const graphqlHTTP = require('express-graphql').graphqlHTTP;

    const schema = await buildSchema({
      resolvers: [__dirname + appConfig.resolversDir],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      container: Container,
    });

    this.app.use('/graphql', (request: express.Request, response: express.Response) => {
      graphqlHTTP({
        schema,
        graphiql: true,
      })(request, response);
    });
  }
}

new App();
