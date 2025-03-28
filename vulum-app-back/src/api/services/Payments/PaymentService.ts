import { Service } from 'typedi';
import { PaymentRepository } from '@api/repositories/Payments/PaymentRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class PaymentService {
  constructor(@InjectRepository() private paymentRepository: PaymentRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.paymentRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedPaymentOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let payment = await this.paymentRepository.createPayment(data);

    this.eventDispatcher.dispatch('onPaymentCreate', payment);

    return payment;
  }

  public async updateOneById(id: number, data: object) {
    const payment = await this.getRequestedPaymentOrFail(id);

    return await this.paymentRepository.updatePayment(payment, data);
  }

  public async deleteOneById(id: number) {
    return await this.paymentRepository.delete(id);
  }

  private async getRequestedPaymentOrFail(id: number, resourceOptions?: object) {
    let payment = await this.paymentRepository.getOneById(id, resourceOptions);

    if (!payment) {
      throw new CategoryNotFoundException();
    }

    return payment;
  }
}
