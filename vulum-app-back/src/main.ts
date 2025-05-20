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
import { getRepository } from 'typeorm';
import Stripe from 'stripe';
import { generateInvoicePdf } from './utils/pdf-generator';

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
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
      }),
    );
    this.app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log(event.data.object, 'event.data.object');
      } catch (err) {
        // console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        const eventType = event.type;
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Received event: ${eventType}`);

        switch (eventType) {
          case 'checkout.session.completed':
            if (!session.metadata) {
              console.log('No metadata found');
              return res.status(400).send('No metadata found');
            }

            const { userId, planId, orderId, productId: productIdsRaw } = session.metadata;

            if (!userId || (!planId && !orderId)) {
              console.log('Missing required metadata fields');
              console.log({ userId, planId, orderId });
              return res.status(400).send('Missing required metadata fields');
            }

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
              where: { id: userId },
              relations: ['PricingPlan'],
            });

            if (!user) return res.status(400).send('User not found');

            if (planId) {
              const planRepository = getRepository(Plan);
              const plan: Plan = await planRepository.findOne({ where: { id: planId } });
              if (!plan) return res.status(400).send('Plan not found');

              user.PricingPlan = plan;
              await userRepository.save(user);
              console.log('User plan updated from checkout.session.completed');
              return res.status(200).send('Plan updated');
            }

            if (orderId) {
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

              const products: any[] = [];
              const productRepository = getRepository(Product);

              if (productIdsRaw) {
                const productIds = productIdsRaw
                  .split(',')
                  .map((id) => Number(id.trim()))
                  .filter((id) => !isNaN(id));

                for (let i = 0; i < productIds.length; i++) {
                  const id = productIds[i];
                  const item = lineItems.data[i];

                  const product = await productRepository.findOne({ where: { id } });

                  if (!product) {
                    console.warn(`⚠️ Product not found for ID: ${id}`);
                    continue;
                  }

                  products.push({
                    product,
                    quantity: item?.quantity ?? 1,
                  });
                }
              }

              user.Orders += 1;
              // products.map((p) => (p.product.Stock -= p.quantity));

              generateInvoicePdf({
                customerName: user.Username,
                customerAddress: user.Address,
                invoiceNumber: String(user.Orders),
                items: products.map((p) => ({
                  description: p.product.ProductName,
                  quantity: p.quantity,
                  price: p.product.Price,
                })),
                stripePaymentId: String(session.payment_intent),
                paymentDate: String(new Date()),
                currency: 'USD',
              });
              await userRepository.save(user);
              // console.log('User order incremented from checkout.session.completed');
              return res.status(200).send('Order incremented');
            }

            return res.status(400).send('No valid metadata found');

          case 'invoice.payment_succeeded':
            const invoice = event.data.object as Stripe.Invoice;
            console.log('Invoice payment succeeded:', invoice);
            return res.status(200).send('Invoice handled');

          case 'customer.subscription.created':
            const subscription = event.data.object as Stripe.Subscription;
            console.log('Customer subscription created:', subscription);
            return res.status(200).send('Subscription handled');

          case 'charge.updated':
            const charge = event.data.object as Stripe.Charge;
            console.log('Charge updated:', charge);
            return res.status(200).send('Charge handled');

          case 'charge.succeeded':
            const succeededCharge = event.data.object as Stripe.Charge;
            console.log('Charge succeeded:', succeededCharge);
            return res.status(200).send('Charge handled');

          default:
            console.log(`Unhandled event type: ${eventType}`);
            return res.status(200).send('Unhandled event type');
        }
      } catch (err) {
        console.error('Webhook handler failed:', err.message);
        return res.status(500).send(`Internal error: ${err.message}`);
      }
    });

    this.setupMiddlewares();
    this.registerSocketControllers();
    this.registerRoutingControllers();
    this.registerDefaultHomePage();
    this.setupSwagger();
    await this.setupGraphQL();
    this.register404Page();
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

  private register404Page() {
    this.app.get('*', function (req, res) {
      res.status(404).send({ status: 404, message: 'Page Not Found!' });
    });
  }

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
