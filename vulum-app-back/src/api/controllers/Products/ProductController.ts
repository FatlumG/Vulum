import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams, Patch } from 'routing-controllers';
import { ProductService } from '@api/services/Products/ProductService';
import { Service } from 'typedi';
import { ProductCreateRequest } from '@api/requests/Products/ProductCreateRequest';
import { CreateProductWithImagesRequest } from '@api/requests/Products/CreateProductWithImagesRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { HasRole } from '@base/infrastructure/middlewares/Auth/HasRole';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { ProductUpdateRequest } from '@api/requests/Products/ProductUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductImagesService } from '@api/services/ProductImages/ProductImagesService';
import { ProductStatus } from '@base/api/models/Products/PEnum';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/products')
@UseBefore(AuthCheck)
export class ProductController extends ControllerBase {
  public constructor(private productService: ProductService, private productImagesService: ProductImagesService) {
    super();
  }

  @UseBefore(HasRole(['Super Admin', 'Admin', 'Manager']))
  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number) {
    return await this.productService.findOneById(id);
  }

  @Get('/available-products')
  public async getAvailableProducts(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getAvailableProducts(resourceOptions);
  }

  @Get('/pending-products')
  public async getPendingProducts(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getPendingProducts(resourceOptions);
  }

  @Get('/unavailable-products')
  public async getUnavailableProducts(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getUnavailableProducts(resourceOptions);
  }

  @Get('/sold-products')
  public async getSoldProducts(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getSoldProducts(resourceOptions);
  }

  @Get('/my-products')
  public async getMyProducts(@LoggedUser() loggedUser: LoggedUserInterface) {
    // const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getMyProducts(loggedUser);
  }

  @Get('/:productName([a-zA-Z]+)')
  public async getByProductName(@Param('productName') productName: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
    return this.productService.getProductsBySearch(productName);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() body: CreateProductWithImagesRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    console.log('Controller is hit!');
    const createdProduct = await this.productService.create(body.product, loggedUser);

    const imagesWithProductId = body.images.map((img) => ({
      ...img,
      product_id: Number(createdProduct.id),
    }));

    console.log('imagesWithProductId', imagesWithProductId);
    const createdImages = await this.productImagesService.create(imagesWithProductId);
    console.log('createdImages', createdImages);
    console.log('createdProduct', createdProduct);

    return {
      product: createdProduct,
      images: createdImages,
    };
  }

  @Put('/:id')
  @UseBefore(HasRole(['Super Admin', 'Admin', 'Manager']))
  public async update(@Param('id') id: number, @Body() product: ProductUpdateRequest) {
    return await this.productService.updateOneById(id, product);
  }

  @Patch('/:id')
  @UseBefore(HasRole(['Super Admin', 'Admin', 'Manager']))
  public async updateStatus(@Param('id') id: number, @Body() body: { status: ProductStatus }) {
    return this.productService.updateStatusById(id, body.status);
  }
  @Delete('/:id')
  @UseBefore(HasRole(['Super Admin', 'Admin', 'Manager']))
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.productService.deleteOneById(id);
  }

  @Get('/images')
  public async getImages(resourceOptions: object) {
    return await this.productImagesService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)/images')
  public async getImagesByProductId(@Param('id') id: number, resourceOptions: object) {
    return await this.productImagesService.getImagesByProductId(id, resourceOptions);
  }
}
