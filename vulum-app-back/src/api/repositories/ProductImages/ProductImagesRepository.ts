import { ProductImages } from '@api/models/ProductImages/ProductImage';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(ProductImages)
export class ProductImagesRepository extends RepositoryBase<ProductImages> {
  public async createProductImages(data: object[]) {
    const entities = data.map((item) => {
      const entity = new ProductImages();
      Object.assign(entity, item);
      return entity;
    });

    return await this.save(entities);
  }

  public async updateProductImages(productImages: ProductImages, data: object) {
    Object.assign(productImages, data);

    return await productImages.save(data);
  }
}
