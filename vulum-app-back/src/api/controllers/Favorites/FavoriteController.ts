import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { FavoriteService } from '@api/services/Favorites/FavoriteService';
import { Service } from 'typedi';
import { FavoriteCreateRequest } from '@api/requests/Favorites/FavoriteCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { FavoriteUpdateRequest } from '@api/requests/Favorites/FavoriteUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';
import { UserService } from '@base/api/services/Users/UserService';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/favorites')
@UseBefore(AuthCheck)
export class FavoriteController extends ControllerBase {
  public constructor(private favoriteService: FavoriteService, private userService: UserService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.favoriteService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.favoriteService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() favorite: FavoriteCreateRequest) {
    return await this.favoriteService.create(favorite);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() favorite: FavoriteUpdateRequest) {
    return await this.favoriteService.updateOneById(id, favorite);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.favoriteService.deleteOneById(id);
  }

  // @Get('/getMyFavorites')
  // public async getMyFavorites(@LoggedUser() loggedUser: LoggedUserInterface, @QueryParams() parseResourceOptions: RequestQueryParser) {
  //   const resourceOptions = parseResourceOptions.getAll();

  //   return await this.favoriteService.getMyFavorites(loggedUser, resourceOptions);
  // }
}
