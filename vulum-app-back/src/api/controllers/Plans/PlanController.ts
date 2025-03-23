import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { PlanService } from '@api/services/Plans/PlanService';
import { Service } from 'typedi';
import { PlanCreateRequest } from '@api/requests/Plans/PlanCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { PlanUpdateRequest } from '@api/requests/Plans/PlanUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/pricing')
@UseBefore(AuthCheck)
export class PlanController extends ControllerBase {
  public constructor(private planService: PlanService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.planService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.planService.findOneById(id, resourceOptions);
  }

  @Get('/me')
  public async getMe(@QueryParams() parseResourceOptions: RequestQueryParser, @LoggedUser() loggedUser: LoggedUserInterface) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.planService.findOneById(loggedUser.userId, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() plan: PlanCreateRequest) {
    return await this.planService.create(plan);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() plan: PlanUpdateRequest) {
    return await this.planService.updateOneById(id, plan);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.planService.deleteOneById(id);
  }
}
