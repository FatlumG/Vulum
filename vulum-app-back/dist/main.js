"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
const fix_module_alias_1 = require("./utils/fix-module-alias");
(0, fix_module_alias_1.fixModuleAlias)(__dirname);
const app_1 = require("@base/config/app");
const load_event_dispatcher_1 = require("@base/utils/load-event-dispatcher");
const routing_controllers_1 = require("routing-controllers");
const load_helmet_1 = require("@base/utils/load-helmet");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const socket_controllers_1 = require("socket-controllers");
const cron_decorators_1 = require("cron-decorators");
const path = __importStar(require("path"));
const express_1 = __importDefault(require("express"));
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const swaggerUiExpress = __importStar(require("swagger-ui-express"));
const type_graphql_1 = require("type-graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const stripe_1 = __importDefault(require("./config/stripe"));
const Plan_1 = require("./api/models/Plans/Plan");
const User_1 = require("./api/models/Users/User");
const Product_1 = require("./api/models/Products/Product");
const Order_1 = require("./api/models/Orders/Order");
const Sale_1 = require("./api/models/Sales/Sale");
const Invoice_1 = require("./api/models/Invoices/Invoice");
const typeorm_2 = require("typeorm");
const pdf_generator_1 = require("./utils/pdf-generator");
const OEnum_1 = require("./api/models/Orders/OEnum");
const PEnum_1 = require("./api/models/Products/PEnum");
const UserSubscription_1 = require("./api/models/Subscriptions/UserSubscription");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = app_1.appConfig.port;
        this.bootstrap();
    }
    bootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useContainers();
            yield this.typeOrmCreateConnection();
            this.registerEvents();
            this.registerCronJobs();
            this.serveStaticFiles();
            this.app.use((0, cors_1.default)({
                origin: '*',
                methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
                preflightContinue: false,
                optionsSuccessStatus: 204,
                allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
            }));
            this.app.post('/api/stripe/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const sig = req.headers['stripe-signature'];
                const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
                let event;
                try {
                    event = stripe_1.default.webhooks.constructEvent(req.body, sig, endpointSecret);
                    // console.log(event.data.object, 'event.data.object');
                }
                catch (err) {
                    return res.status(400).send(`Webhook Error: ${err.message}`);
                }
                try {
                    const eventType = event.type;
                    const session = event.data.object;
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
                            const userRepository = (0, typeorm_2.getRepository)(User_1.User);
                            const user = yield userRepository.findOne({
                                where: { id: userId },
                                relations: ['pricing_plan'],
                            });
                            if (!user)
                                return res.status(400).send('User not found');
                            if (planId) {
                                const planRepository = (0, typeorm_2.getRepository)(Plan_1.Plan);
                                const plan = yield planRepository.findOne({ where: { id: planId } });
                                if (!plan)
                                    return res.status(400).send('Plan not found');
                                // console.log(user, 'user');
                                // console.log(plan, 'plan');
                                const subscriptionRepository = (0, typeorm_2.getRepository)(UserSubscription_1.UserSubscription);
                                if (!session.subscription) {
                                    throw new Error('No subscription ID found in session.');
                                }
                                const stripeSubscription = (yield stripe_1.default.subscriptions.retrieve(session.subscription));
                                const subscriptionItem = stripeSubscription.items.data[0];
                                const current_period_end = new Date(subscriptionItem.current_period_end * 1000).toISOString();
                                const start_date = typeof stripeSubscription.start_date === 'number' && stripeSubscription.start_date > 0
                                    ? new Date(stripeSubscription.start_date * 1000).toISOString()
                                    : null;
                                const trial_ends_at = typeof stripeSubscription.trial_end === 'number' && stripeSubscription.trial_end > 0
                                    ? new Date(stripeSubscription.trial_end * 1000).toISOString()
                                    : null;
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
                                const subscription = subscriptionRepository.create(subscriptionData);
                                yield subscriptionRepository.save(subscription);
                                console.log(subscriptionData, 'subscriptionData');
                                user.pricing_plan = plan;
                                yield userRepository.save(user);
                                console.log('User plan updated from checkout.session.completed');
                                return res.status(200).send('Plan updated');
                            }
                            if (orderId) {
                                const lineItems = yield stripe_1.default.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
                                const products = [];
                                const productRepository = (0, typeorm_2.getRepository)(Product_1.Product);
                                const orderRepository = (0, typeorm_2.getRepository)(Order_1.Order);
                                const saleRepository = (0, typeorm_2.getRepository)(Sale_1.Sale);
                                if (productIdsRaw) {
                                    const productIds = productIdsRaw
                                        .split(',')
                                        .map((id) => Number(id.trim()))
                                        .filter((id) => !isNaN(id));
                                    for (let i = 0; i < productIds.length; i++) {
                                        const id = productIds[i];
                                        const item = lineItems.data[i];
                                        const product = yield productRepository.findOne({ where: { id } });
                                        if (!product) {
                                            console.warn(`⚠️ Product not found for ID: ${id}`);
                                            continue;
                                        }
                                        product.stock -= (_a = item === null || item === void 0 ? void 0 : item.quantity) !== null && _a !== void 0 ? _a : 1;
                                        product.status = PEnum_1.ProductStatus.SOLD;
                                        yield productRepository.save(product);
                                        if (!product.price || !product.created_by || !orderId) {
                                            throw new Error('Missing product data or orderId');
                                        }
                                        const sale = new Sale_1.Sale();
                                        const prodOwner = yield userRepository.findOne({ where: { id: product.created_by } });
                                        sale.order_id = Number(orderId);
                                        sale.total_price = product.price;
                                        sale.user_id = product.created_by;
                                        yield saleRepository.save(sale);
                                        prodOwner.sales += 1;
                                        yield userRepository.save(prodOwner);
                                        products.push({
                                            product,
                                            quantity: (_b = item === null || item === void 0 ? void 0 : item.quantity) !== null && _b !== void 0 ? _b : 1,
                                        });
                                    }
                                }
                                const order = yield orderRepository.findOne({ where: { id: orderId } });
                                order.status = OEnum_1.OrderStatus.CONFIRMED;
                                user.orders += 1;
                                (0, pdf_generator_1.generateInvoicePdf)({
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
                                const invoiceId = parseInt(session.metadata.invoiceId);
                                const invoiceRepository = (0, typeorm_2.getRepository)(Invoice_1.Invoice);
                                const invoice = yield invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['order'] });
                                if (!invoice)
                                    throw new Error('Invoice not found');
                                invoice.status = 'paid';
                                invoice.stripe_invoice_id = (_c = session.payment_intent) === null || _c === void 0 ? void 0 : _c.toString();
                                invoice.stripe_customer_id = (_d = session.customer) === null || _d === void 0 ? void 0 : _d.toString();
                                yield invoiceRepository.save(invoice);
                                invoice.order.status = OEnum_1.OrderStatus.APPROVED;
                                console.log(invoice);
                                yield invoiceRepository.save(invoice.order);
                                yield userRepository.save(user);
                                yield orderRepository.save(order);
                                return res.status(200).send('Order incremented');
                            }
                            return res.status(400).send('No valid metadata found');
                        // case 'invoice.payment_succeeded':
                        //   const invoice = event.data.object as Stripe.Invoice;
                        //   console.log('Invoice payment succeeded:', invoice);
                        //   return res.status(200).send('Invoice handled');
                        case 'invoice.created':
                            const invoiceId = parseInt(session.metadata.invoiceId);
                            const invoiceRepository = (0, typeorm_2.getRepository)(Invoice_1.Invoice);
                            const invoice = yield invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['order'] });
                            invoice.status = 'created';
                            yield invoiceRepository.save(invoice);
                            break;
                        case 'invoice.finalized':
                            invoice.status = 'finalized';
                            yield invoiceRepository.save(invoice);
                            break;
                        case 'invoice.paid':
                            invoice.status = 'paid';
                            yield invoiceRepository.save(invoice);
                            break;
                        case 'invoice.payment_succeeded': {
                            const invoice = event.data.object;
                            // Safely parse date fields, if any
                            const periodEnd = invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null;
                            const periodStart = invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null;
                            // You can add your logic here to update invoice status in DB or send notifications
                            console.log(`Invoice event: ${event.type}, Invoice ID: ${invoice.id}`);
                            console.log('Period start:', periodStart);
                            console.log('Period end:', periodEnd);
                            return res.status(200).send(`Handled ${event.type}`);
                        }
                        case 'payment_intent.created': {
                            const paymentIntent = event.data.object;
                            console.log('Payment Intent created:', paymentIntent.id);
                            // Optional: update DB or notify user here
                            return res.status(200).send('Payment Intent created handled');
                        }
                        //needs to be fixed
                        case 'invoice.payment_failed': {
                            const invoice = event.data.object;
                            // Stripe.Invoice
                            console.log('Invoice payment failed:', invoice);
                            // Example: update subscription status to 'past_due' in your DB
                            const subscriptionRepository = (0, typeorm_2.getRepository)(UserSubscription_1.UserSubscription);
                            const subscription = yield subscriptionRepository.findOne({
                                where: { stripe_subscription_id: invoice.subscription },
                            });
                            if (subscription) {
                                subscription.status = 'past_due';
                                yield subscriptionRepository.save(subscription);
                                console.log(`Subscription ${subscription.id} marked as past_due.`);
                            }
                            // TODO: Notify user by email or other means
                            return res.status(200).send('Invoice payment failed handled');
                        }
                        case 'customer.subscription.created':
                            const subscription = event.data.object;
                            console.log('Customer subscription created:', subscription);
                            return res.status(200).send('Subscription handled');
                        //needs to be fixed
                        case 'customer.subscription.updated': {
                            const subscription = event.data.object;
                            console.log('Subscription updated:', subscription);
                            const subscriptionRepository = (0, typeorm_2.getRepository)(UserSubscription_1.UserSubscription);
                            const existingSub = yield subscriptionRepository.findOne({
                                where: { stripe_subscription_id: subscription.id },
                            });
                            //@ts-ignore
                            // const currentPeriodEndTimestamp = stripeSubscription.current_period_end;
                            // if (!currentPeriodEndTimestamp) {
                            //   throw new Error('Stripe subscription missing current_period_end');
                            // }
                            // const current_period_end = new Date(currentPeriodEndTimestamp * 1000).toISOString();
                            // if (existingSub) {
                            //   existingSub.status = subscription.status;
                            //   existingSub.current_period_end = current_period_end;
                            //   existingSub.cancel_at_period_end = subscription.cancel_at_period_end;
                            //   existingSub.trial_ends_at = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;
                            //   await subscriptionRepository.save(existingSub);
                            //   console.log(`Subscription ${existingSub.id} updated.`);
                            // }
                            // return res.status(200).send('Subscription updated handled');
                            const currentPeriodEndTimestamp = stripeSubscription.current_period_end;
                            if (!currentPeriodEndTimestamp || isNaN(currentPeriodEndTimestamp)) {
                                throw new Error('Stripe subscription missing or invalid current_period_end');
                            }
                            const current_period_end = new Date(currentPeriodEndTimestamp * 1000).toISOString();
                            if (existingSub) {
                                existingSub.status = subscription.status;
                                existingSub.current_period_end = current_period_end;
                                existingSub.cancel_at_period_end = !!subscription.cancel_at_period_end;
                                if (subscription.trial_end && !isNaN(subscription.trial_end)) {
                                    existingSub.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString();
                                }
                                else {
                                    existingSub.trial_ends_at = null;
                                }
                                yield subscriptionRepository.save(existingSub);
                                console.log(`Subscription ${existingSub.id} updated.`);
                            }
                            return res.status(200).send('Subscription update handled');
                        }
                        //needs to be fixed
                        case 'customer.subscription.deleted': {
                            const subscription = event.data.object;
                            console.log('Subscription deleted:', subscription);
                            const subscriptionRepository = (0, typeorm_2.getRepository)(UserSubscription_1.UserSubscription);
                            const existingSub = yield subscriptionRepository.findOne({
                                where: { stripe_subscription_id: subscription.id },
                            });
                            if (existingSub) {
                                existingSub.status = 'canceled';
                                yield subscriptionRepository.save(existingSub);
                                console.log(`Subscription ${existingSub.id} marked as canceled.`);
                            }
                            return res.status(200).send('Subscription deleted handled');
                        }
                        case 'charge.updated':
                            const charge = event.data.object;
                            console.log('Charge updated:', charge);
                            return res.status(200).send('Charge handled');
                        case 'charge.succeeded':
                            const succeededCharge = event.data.object;
                            console.log('Charge succeeded:', succeededCharge);
                            return res.status(200).send('Charge handled');
                        default:
                            console.log(`Unhandled event type: ${eventType}`);
                            return res.status(200).send('Unhandled event type');
                    }
                }
                catch (err) {
                    console.error('Webhook handler failed:', err.message);
                    return res.status(500).send(`Internal error: ${err.message}`);
                }
            }));
            this.setupMiddlewares();
            this.registerSocketControllers();
            this.registerRoutingControllers();
            this.registerDefaultHomePage();
            this.setupSwagger();
            yield this.setupGraphQL();
            // this.register404Page();
        });
    }
    useContainers() {
        (0, routing_controllers_1.useContainer)(typedi_1.Container);
        (0, typeorm_1.useContainer)(typeorm_typedi_extensions_1.Container);
        (0, socket_controllers_1.useContainer)(typedi_1.Container);
        (0, cron_decorators_1.useContainer)(typedi_1.Container);
    }
    typeOrmCreateConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, typeorm_1.createConnection)();
            }
            catch (error) {
                console.log('Caught! Cannot connect to database: ', error);
            }
        });
    }
    registerEvents() {
        return (0, load_event_dispatcher_1.loadEventDispatcher)();
    }
    registerCronJobs() {
        if (!app_1.appConfig.cronJobsEnabled) {
            return false;
        }
        (0, cron_decorators_1.registerController)([__dirname + app_1.appConfig.cronJobsDir]);
    }
    serveStaticFiles() {
        this.app.use('/public', express_1.default.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
    }
    setupMiddlewares() {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json());
        (0, load_helmet_1.loadHelmet)(this.app);
    }
    registerSocketControllers() {
        const server = require('http').Server(this.app);
        const io = require('socket.io')(server);
        this.app.use(function (req, res, next) {
            req.io = io;
            next();
        });
        server.listen(this.port, () => console.log(`🚀 Server started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`));
        (0, socket_controllers_1.useSocketServer)(io, {
            controllers: [__dirname + app_1.appConfig.controllersDir],
        });
    }
    registerRoutingControllers() {
        (0, routing_controllers_1.useExpressServer)(this.app, {
            validation: { stopAtFirstError: true },
            cors: true,
            classTransformer: true,
            defaultErrorHandler: false,
            routePrefix: app_1.appConfig.routePrefix,
            controllers: [__dirname + app_1.appConfig.controllersDir],
            middlewares: [__dirname + app_1.appConfig.middlewaresDir],
        });
    }
    registerDefaultHomePage() {
        this.app.get('/', (req, res) => {
            res.json({
                title: app_1.appConfig.name,
                mode: app_1.appConfig.node,
                date: new Date(),
            });
        });
    }
    // private register404Page() {
    //   this.app.get('*', function (req, res) {
    //     res.status(404).send({ status: 404, message: 'Page Not Found!' });
    //   });
    // }
    setupSwagger() {
        // Parse class-validator classes into JSON Schema
        const schemas = (0, class_validator_jsonschema_1.validationMetadatasToSchemas)({
            refPointerPrefix: '#/components/schemas/',
        });
        // Parse routing-controllers classes into OpenAPI spec:
        const storage = (0, routing_controllers_1.getMetadataArgsStorage)();
        const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(storage, { routePrefix: app_1.appConfig.routePrefix }, {
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
        });
        // Use Swagger
        this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    }
    setupGraphQL() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!app_1.appConfig.graphqlEnabled) {
                return false;
            }
            const graphqlHTTP = require('express-graphql').graphqlHTTP;
            const schema = yield (0, type_graphql_1.buildSchema)({
                resolvers: [__dirname + app_1.appConfig.resolversDir],
                emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
                container: typedi_1.Container,
            });
            this.app.use('/graphql', (request, response) => {
                graphqlHTTP({
                    schema,
                    graphiql: true,
                })(request, response);
            });
        });
    }
}
exports.App = App;
new App();
//# sourceMappingURL=main.js.map