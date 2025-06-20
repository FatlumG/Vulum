import { Service } from 'typedi';
import { ProductImagesRepository } from '@api/repositories/ProductImages/ProductImagesRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductImagesCreateRequest } from '@base/api/requests/ProductImages/ProductImagesCreateRequest';

@Service()
export class ProductImagesService {
  constructor(
    @InjectRepository() private productImagesRepository: ProductImagesRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    // return await this.productImagesRepository.getManyAndCount(resourceOptions);
    return await this.productImagesRepository.find({ ...resourceOptions });
  }

  public async getImagesByProductId(id: number, resourceOptions?: object) {
    return await this.getRequestedProductImagesOrFail(id, resourceOptions);
  }

  public async create(data: ProductImagesCreateRequest[]) {

    let productImages = await this.productImagesRepository.createProductImages(data);

    this.eventDispatcher.dispatch('onProductImagesCreate', productImages);

    return productImages;
  }

  public async updateOneById(id: number, data: object) {
    const productImages = await this.getRequestedProductImagesOrFail(id);

    return await this.productImagesRepository.updateProductImages(productImages, data);
  }

  public async deleteOneById(id: number) {
    return await this.productImagesRepository.delete(id);
  }

  // public async getMyProductImagess(loggedUser: LoggedUserInterface, resourceOptions?: object) {
  //   return await this.orderRepository.find({
  //     where: { created_by: loggedUser.userId, status: 'productImages' },
  //     ...resourceOptions,
  //   });
  // }

  private async getRequestedProductImagesOrFail(id: number, resourceOptions?: object) {
    let productImages = await this.productImagesRepository.getOneById(id, resourceOptions);

    if (!productImages) {
      throw new CategoryNotFoundException();
    }

    return productImages;
  }
}
