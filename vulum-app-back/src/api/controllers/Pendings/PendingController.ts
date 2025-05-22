import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { PendingService } from '@api/services/Pendings/PendingService';
import { Service } from 'typedi';
import { PendingCreateRequest } from '@api/requests/Pendings/PendingCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { PendingUpdateRequest } from '@api/requests/Pendings/PendingUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/pendings')
@UseBefore(AuthCheck)
export class PendingController extends ControllerBase {
  public constructor(private pendingService: PendingService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.pendingService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') PendingId: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.pendingService.findOneById(PendingId, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() pending: PendingCreateRequest, @LoggedUser() LoggedUser: LoggedUserInterface) {
    return await this.pendingService.create(pending, LoggedUser);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() pending: PendingUpdateRequest) {
    return await this.pendingService.updateOneById(id, pending);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.pendingService.deleteOneById(id);
  }

  @Get('/getMyPendings')
  public async getMyPendings(@LoggedUser() loggedUser: LoggedUserInterface, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.pendingService.getMyPendings(loggedUser, resourceOptions);
  }
}
