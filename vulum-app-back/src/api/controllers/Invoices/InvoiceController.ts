import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { InvoiceService } from '@api/services/Invoices/InvoiceService';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/invoices')
@UseBefore(AuthCheck)
export class InvoiceController extends ControllerBase {
  public constructor(private invoiceService: InvoiceService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.invoiceService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.invoiceService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() invoice: any) {
    return await this.invoiceService.create(invoice);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() invoice: any) {
    return await this.invoiceService.updateOneById(id, invoice);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.invoiceService.deleteOneById(id);
  }

  @Get('/get-my-invoices')
  public async getMyInvoices(@LoggedUser() loggedUser: LoggedUserInterface, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const page = parseResourceOptions.getPage() || 1;
    const limit = parseResourceOptions.parseLimit() || 10;

    console.log(loggedUser, 'loggedUser');
    console.log(page, 'page');
    console.log(limit, 'limit');

    return await this.invoiceService.getMyInvoices(loggedUser, page, limit);
  }
}
