import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { UserSubscriptionService } from '@api/services/Subscription/UserSubscriptionService';
import { Service } from 'typedi';
import { UserSubscriptionCreateRequest } from '@api/requests/Subscriptions/UserSubscriptionCreateRequest';
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
@JsonController('/user-subscription')
@UseBefore(AuthCheck)
export class UserSubscriptionController extends ControllerBase {
  public constructor(private userSubscriptionService: UserSubscriptionService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userSubscriptionService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userSubscriptionService.findOneById(id, resourceOptions);
  }

  @Get('/my-subscription')
  public async getMySubscription(@LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.userSubscriptionService.getMySubscription(loggedUser.userId);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() userSubscription: UserSubscriptionCreateRequest) {
    return await this.userSubscriptionService.create(userSubscription);
  }

  //   @Put('/:id')
  //   public async update(@Param('id') id: number, @Body() userSubscription: UserSubscriptionUpdateRequest) {
  //     return await this.userSubscriptionService.updateOneById(id, userSubscription);
  //   }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.userSubscriptionService.deleteOneById(id);
  }
}
