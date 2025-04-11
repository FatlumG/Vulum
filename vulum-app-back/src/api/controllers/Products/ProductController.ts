import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { ProductService } from '@api/services/Products/ProductService';
import { Service } from 'typedi';
import { ProductCreateRequest } from '@api/requests/Products/ProductCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { ProductUpdateRequest } from '@api/requests/Products/ProductUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { UserService } from '@base/api/services/Users/UserService';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/products')
@UseBefore(AuthCheck)
export class ProductController extends ControllerBase {
  public constructor(private productService: ProductService, private userService: UserService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.productService.findOneById(id, resourceOptions);
  }

  @Get('/:productName([a-zA-Z]+)')
  public async getByProductName(@Param('productName') productName: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
    return this.productService.getProductsBySearch(productName);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() product: ProductCreateRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.productService.create(product, loggedUser); // ✅ pass the loggedUser directly
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() product: ProductUpdateRequest) {
    return await this.productService.updateOneById(id, product);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.productService.deleteOneById(id);
  }
}
