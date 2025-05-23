import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { CategoryService } from '@api/services/Categories/CategoryService';
import { Service } from 'typedi';
import { CategoryCreateRequest } from '@api/requests/Categories/CategoryCreateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { CategoryUpdateRequest } from '@api/requests/Categories/CategoryUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { HasRole } from '@base/infrastructure/middlewares/Auth/HasRole';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/categories')
@UseBefore(AuthCheck)
export class CategoryController extends ControllerBase {
  public constructor(private categoryService: CategoryService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.categoryService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.categoryService.findOneById(id, resourceOptions);
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() category: CategoryCreateRequest) {
    return await this.categoryService.create(category);
  }

  @Put('/:id')
  @UseBefore(HasRole('admin'))
  public async update(@Param('id') id: number, @Body() category: CategoryUpdateRequest) {
    return await this.categoryService.updateOneById(id, category);
  }

  @Delete('/:id')
  @UseBefore(HasRole('admin'))
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.categoryService.deleteOneById(id);
  }
}
