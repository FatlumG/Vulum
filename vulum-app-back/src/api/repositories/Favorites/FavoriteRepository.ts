import { Favorite } from '@api/models/Favorites/Favorite';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Favorite)
export class FavoriteRepository extends RepositoryBase<Favorite> {
  public async createFavorite(data: object) {
    let entity = new Favorite();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateFavorite(favorite: Favorite, data: object) {
    Object.assign(favorite, data);

    return await favorite.save(data);
  }
}
