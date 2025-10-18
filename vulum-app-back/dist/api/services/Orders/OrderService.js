"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.OrderService = void 0;
const typedi_1 = require("typedi");
const OrderRepository_1 = require("@api/repositories/Orders/OrderRepository");
const CategoryNotFoundException_1 = require("@api/exceptions/Categories/CategoryNotFoundException");
const EventDispatcher_1 = require("@base/decorators/EventDispatcher");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const ProductRepository_1 = require("@base/api/repositories/Products/ProductRepository");
const OrderItemRepository_1 = require("@base/api/repositories/OrderItems/OrderItemRepository");
const InvoiceRepository_1 = require("@base/api/repositories/Invoices/InvoiceRepository");
const stripe_1 = __importDefault(require("@base/config/stripe"));
const UserRepository_1 = require("@base/api/repositories/Users/UserRepository");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, productRepository, invoiceRepository, userRepository, eventDispatcher) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.eventDispatcher = eventDispatcher;
        //
    }
    getAll(resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.getManyAndCount(resourceOptions);
        });
    }
    findOneById(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRequestedOrderOrFail(id, resourceOptions);
        });
    }
    createCheckoutSession(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = data.items;
            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new Error('No items provided for the order.');
            }
            const productIds = items.map((item) => item.product_id);
            const products = yield this.productRepository.findByIds(productIds);
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
                if (product.created_by === user.userId) {
                    throw new Error(`You cannot buy your own product.`);
                }
                if (item.quantity <= 0) {
                    throw new Error(`Invalid quantity for ${product.product_name}.`);
                }
                totalAmount += product.price * item.quantity;
                if (!product.stripe_price_id) {
                    throw new Error(`Stripe Price ID missing for product ${product.product_name}.`);
                }
                if (product.stock < (item === null || item === void 0 ? void 0 : item.quantity)) {
                    throw new Error(`Not enough stock for ${product.product_name}.`);
                }
                stripeLineItems.push({
                    price: product.stripe_price_id,
                    quantity: item.quantity || 1,
                });
            }
            const order = yield this.orderRepository.createOrder({
                name: `Order-${Date.now()}`,
                amount: totalAmount,
                status: 'pending',
                created_by: user.userId,
            });
            for (const item of items) {
                yield this.orderItemRepository.createOrderItem({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    total_amount: products.find((p) => p.id === item.product_id).price * item.quantity,
                });
            }
            let stripeCustomerId = user.stripe_customer_id;
            if (!stripeCustomerId) {
                const customer = yield stripe_1.default.customers.create({
                    email: user.email,
                    name: user.name,
                });
                stripeCustomerId = customer.id;
                // await this.userRepository.save(user);
                console.log('user.userId:', user.userId);
                yield this.userRepository.update({ id: user.userId }, { stripe_customer_id: stripeCustomerId });
            }
            const session = yield stripe_1.default.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer: stripeCustomerId,
                line_items: stripeLineItems,
                success_url: `http://localhost:5173/dashboard`,
                cancel_url: 'http://localhost:3000/cancel',
                metadata: {
                    userId: user.userId,
                    orderId: order.id,
                    productId: productIds.join(','),
                    // invoiceId: invoice.id,
                },
            });
            console.log(user, 'user');
            console.log(user.userId, 'user.userId');
            const invoice = yield this.invoiceRepository.createInvoice({
                user: user.userId,
                order: order.id,
                stripe_invoice_id: session.id,
                stripe_customer_id: stripeCustomerId,
                status: 'pending',
                amount_due: totalAmount,
                currency: 'usd', // or your currency
            });
            return { url: session.url, invoiceId: invoice.id };
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.getRequestedOrderOrFail(id);
            return yield this.orderRepository.updateOrder(order, data);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.delete(id);
        });
    }
    getRequestedOrderOrFail(id, resourceOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = yield this.orderRepository.getOneById(id, resourceOptions);
            if (!order) {
                throw new CategoryNotFoundException_1.CategoryNotFoundException();
            }
            return order;
        });
    }
};
OrderService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(1, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(2, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(3, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(4, (0, typeorm_typedi_extensions_1.InjectRepository)()),
    __param(5, (0, EventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [OrderRepository_1.OrderRepository,
        OrderItemRepository_1.OrderItemRepository,
        ProductRepository_1.ProductRepository,
        InvoiceRepository_1.InvoiceRepository,
        UserRepository_1.UserRepository,
        EventDispatcher_1.EventDispatcherInterface])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map