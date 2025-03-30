import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { PaymentService } from '@api/services/Payments/PaymentService';
import { Service } from 'typedi';
import { PaymentCreateRequest } from '@base/api/requests/Payments/PaymentCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { PaymentUpdateRequest } from '@api/requests/Payments/PaymentUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/payments')
@UseBefore(AuthCheck)
export class PaymentController extends ControllerBase {
  public constructor(private paymentService: PaymentService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.paymentService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.paymentService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() payment: PaymentCreateRequest) {
    return await this.paymentService.create(payment);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() payment: PaymentUpdateRequest) {
    return await this.paymentService.updateOneById(id, payment);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.paymentService.deleteOneById(id);
  }
}
