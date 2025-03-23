import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { SaleService } from '@api/services/Sales/SaleService';
import { Service } from 'typedi';
import { SaleCreateRequest } from '@api/requests/Sales/SaleCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { SaleUpdateRequest } from '@api/requests/Sales/SaleUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/sales')
@UseBefore(AuthCheck)
export class SaleController extends ControllerBase {
  public constructor(private saleService: SaleService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.saleService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.saleService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() sale: SaleCreateRequest) {
    return await this.saleService.create(sale);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() sale: SaleUpdateRequest) {
    return await this.saleService.updateOneById(id, sale);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.saleService.deleteOneById(id);
  }
}
