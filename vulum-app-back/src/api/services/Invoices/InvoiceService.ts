import { Service } from 'typedi';
import { InvoiceRepository } from '@api/repositories/Invoices/InvoiceRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
@Service()
export class InvoiceService {
  constructor(
    @InjectRepository() private invoiceRepository: InvoiceRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.invoiceRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedInvoiceOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let invoice = await this.invoiceRepository.createInvoice(data);

    this.eventDispatcher.dispatch('onInvoiceCreate', invoice);

    return invoice;
  }

  public async updateOneById(id: number, data: object) {
    const invoice = await this.getRequestedInvoiceOrFail(id);

    return await this.invoiceRepository.updateInvoice(invoice, data);
  }

  public async deleteOneById(id: number) {
    return await this.invoiceRepository.delete(id);
  }

  private async getRequestedInvoiceOrFail(id: number, resourceOptions?: object) {
    let invoice = await this.invoiceRepository.getOneById(id, resourceOptions);

    if (!invoice) {
      throw new CategoryNotFoundException();
    }

    return invoice;
  }

  public async countInvoicesForUser(userId: number) {
    return await this.invoiceRepository.count({ where: { user_id: userId } });
  }

  public async getMyInvoices(user: LoggedUserInterface, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.order', 'order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.productsList', 'product')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .where('order.created_by = :userId', { userId: user.userId })
      .skip(skip)
      .take(limit)
      .orderBy('invoice.created_at', 'DESC')
      .getManyAndCount();

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
