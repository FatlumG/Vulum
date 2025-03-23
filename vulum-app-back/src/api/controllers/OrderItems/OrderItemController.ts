import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { OrderItemService } from '@api/services/OrderItems/OrderItemService';
import { Service } from 'typedi';
import { OrderItemCreateRequest } from '@api/requests/OrderItems/OrderItemCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OrderItemUpdateRequest } from '@api/requests/OrderItems/OrderItemUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/orderitems')
@UseBefore(AuthCheck)
export class OrderItemController extends ControllerBase {
  public constructor(private orderItemService: OrderItemService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.orderItemService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.orderItemService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() orderItem: OrderItemCreateRequest) {
    return await this.orderItemService.create(orderItem);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() orderItem: OrderItemUpdateRequest) {
    return await this.orderItemService.updateOneById(id, orderItem);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.orderItemService.deleteOneById(id);
  }
}
