import { Invoice } from '@api/models/Invoices/Invoice';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Invoice)
export class InvoiceRepository extends RepositoryBase<Invoice> {
  public async createInvoice(data: object) {
    let entity = new Invoice();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateInvoice(invoice: Invoice, data: object) {
    Object.assign(invoice, data);

    return await invoice.save(data);
  }
}
