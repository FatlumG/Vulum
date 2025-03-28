import { Payment } from '@api/models/Payments/Payment';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Payment)
export class PaymentRepository extends RepositoryBase<Payment> {
  public async createPayment(data: object) {
    let entity = new Payment();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updatePayment(payment: Payment, data: object) {
    Object.assign(payment, data);

    return await payment.save(data);
  }
}
