import { NotFoundError } from 'routing-controllers';

export class ProductNotFoundException extends NotFoundError {
  constructor() {
    super('Product not found!');
  }
}
