import { Service } from 'typedi';
import { FavoriteRepository } from '@api/repositories/Favorites/FavoriteRepository';
import { CategoryNotFoundException } from '@api/exceptions/Categories/CategoryNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '@base/api/models/Users/User';
import { UserRepository } from '@base/api/repositories/Users/UserRepository';
import { LoggedUserInterface } from '@base/api/interfaces/users/LoggedUserInterface';
import { FavoriteCreateRequest } from '@base/api/requests/Favorites/FavoriteCreateRequest';
@Service()
export class FavoriteService {
  constructor(
    @InjectRepository() private favoriteRepository: FavoriteRepository,
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

  public async create(data: object) {
    let favorite = await this.favoriteRepository.createFavorite(data);

    this.eventDispatcher.dispatch('onFavoriteCreate', favorite);

    return favorite;
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

  // public async countFavoritesForUser(userId: number) {
  //   return await this.favoriteRepository.count({ where: { UserId: userId } });
  // }

  // public async getMyFavorites(user: LoggedUserInterface, resourceOptions?: object) {
  //   return await this.favoriteRepository.find({
  //     where: { UserId: user.userId },
  //     ...resourceOptions,
  //   });
  // }
}
