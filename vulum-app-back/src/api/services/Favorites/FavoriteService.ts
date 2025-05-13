import { Service } from 'typedi';
import { FavoriteRepository } from '@api/repositories/Favorites/FavoriteRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { ProductRepository } from '@base/api/repositories/Products/ProductRepository';
@Service()
export class FavoriteService {
  constructor(
    @InjectRepository() private favoriteRepository: FavoriteRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private userRepository: UserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.favoriteRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedFavoriteOrFail(id, resourceOptions);
  }

  public async create(data: any, loggedUser: LoggedUserInterface) {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user_id: loggedUser.userId,
        product_id: data.product_id,
      },
    });

    if (existingFavorite) {
      throw new Error('This Product is already saved!');
    }

    const favorite = await this.favoriteRepository.createFavorite({
      ...data,
      user_id: loggedUser.userId,
    });

    const user = await this.userRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: favorite.user_id })
      .select(['User.Username', 'User.FName', 'User.LName', 'User.Email', 'User.Phone', 'User.Favorites'])
      .getOne();

    const product = await this.productRepository
      .createQueryBuilder('products')
      .where('products.id = :id', { id: favorite.product_id })
      .select(['products.ProductName', 'products.ProductDescription', 'products.Price'])
      .getOne();

    this.eventDispatcher.dispatch('onFavoriteCreate', favorite);
    this.userRepository.update(favorite.user_id, { Favorites: user.Favorites + 1 });
    return {
      ...favorite,
      user,
      product,
    };
  }

  public async updateOneById(id: number, data: object) {
    const favorite = await this.getRequestedFavoriteOrFail(id);

    return await this.favoriteRepository.updateFavorite(favorite, data);
  }

  public async deleteOneById(id: number) {
    return await this.favoriteRepository.delete(id);
  }

  private async getRequestedFavoriteOrFail(id: number, resourceOptions?: object) {
    let favorite = await this.favoriteRepository.getOneById(id, resourceOptions);

    if (!favorite) {
      throw new CategoryNotFoundException();
    }

    return favorite;
  }

  public async countFavoritesForUser(userId: number) {
    return await this.favoriteRepository.count({ where: { user_id: userId } });
  }

  public async getMyFavorites(user: LoggedUserInterface, resourceOptions?: object) {
    return await this.favoriteRepository.find({
      where: { user_id: user.userId },
      ...resourceOptions,
    });
  }
}
