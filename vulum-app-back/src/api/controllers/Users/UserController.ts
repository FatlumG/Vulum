import { Param, Req, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams, UseInterceptor } from 'routing-controllers';
import { UserService } from '@api/services/Users/UserService';
import { Service } from 'typedi';
import { UserCreateRequest } from '@api/requests/Users/UserCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { HasRole } from '@base/infrastructure/middlewares/Auth/HasRole';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { UserUpdateRequest } from '@api/requests/Users/UserUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';
import { upload } from '@base/utils/multer';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/users')
@UseBefore(AuthCheck)
export class UserController extends ControllerBase {
  public constructor(private userService: UserService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userService.findOneById(id, resourceOptions);
  }

  @Get('/me')
  public async getMe(@QueryParams() parseResourceOptions: RequestQueryParser, @LoggedUser() loggedUser: LoggedUserInterface) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.userService.findOneById(loggedUser.userId, resourceOptions);
  }

  @Get('/profile')
  public async getProfile(@LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.userService.getProfile(loggedUser.userId);
  }

  @Get('/:username')
  public async getBySearch(@Param('username') username: string, @QueryParams() parseResourceOptions: RequestQueryParser) {
    return this.userService.getUsersBySearch(username);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() user: UserCreateRequest) {
    return await this.userService.create(user);
  }

  @Put('/:id')
  @UseBefore(HasRole('admin'))
  public async update(@Param('id') id: number, @Body() user: UserUpdateRequest) {
    return await this.userService.updateOneById(id, user);
  }

  // @Put('/update-my-profile-picture')
  // public async updateMyProfilePicture(@LoggedUser() LoggedUser: LoggedUserInterface, @Body() image: Express.Multer.File) {
  //   return await this.userService.updateProfilePicture(LoggedUser.userId, image);
  // }

  @Put('/update-my-profile-picture')
  @UseBefore(upload.single('image')) // Multer middleware to handle 'image' field
  public async updateMyProfilePicture(@LoggedUser() loggedUser: LoggedUserInterface, @Req() req: any, @Body() image: any) {
    const file = req.file;

    if (!file) {
      throw new Error('Image is required!');
    }

    return await this.userService.updateProfilePicture(loggedUser.userId, file.path);
  }

  @Delete('/:id')
  @UseBefore(HasRole('admin'))
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.userService.deleteOneById(id);
  }
}
