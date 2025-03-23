import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { OrderService } from '@api/services/Orders/OrderService';
import { Service } from 'typedi';
import { OrderCreateRequest } from '@api/requests/Orders/OrderCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OrderUpdateRequest } from '@api/requests/Orders/OrderUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/orders')
@UseBefore(AuthCheck)
export class OrderController extends ControllerBase {
  public constructor(private orderService: OrderService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.orderService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.orderService.findOneById(id, resourceOptions);
  }

  @Get('/me')
  public async getMe(@QueryParams() parseResourceOptions: RequestQueryParser, @LoggedUser() loggedUser: LoggedUserInterface) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.orderService.findOneById(loggedUser.userId, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() order: OrderCreateRequest) {
    return await this.orderService.create(order);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() order: OrderUpdateRequest) {
    return await this.orderService.updateOneById(id, order);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.orderService.deleteOneById(id);
  }
}
