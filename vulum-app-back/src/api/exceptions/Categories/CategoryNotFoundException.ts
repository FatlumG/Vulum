import { NotFoundError } from 'routing-controllers';

export class CategoryNotFoundException extends NotFoundError {
  constructor() {
    super('Category not found!');
  }
}
