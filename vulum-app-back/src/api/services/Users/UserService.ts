import { Service } from 'typedi';
import { UserRepository } from '@api/repositories/Users/UserRepository';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import cloudinary from '@base/utils/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { UserUpdateRequest } from '@base/api/requests/Users/UserUpdateRequest';

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.userRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedUserOrFail(id, resourceOptions);
  }

  public async getProfile(id: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user.id', 'user.first_name', 'user.last_name', 'user.profile_photo_url', 'role.role_name'])
      .where('user.id = :id', { id })
      .getOne();
  }

  public async create(data: object) {
    const existingUser = await this.userRepository.findOne(data);
    if (existingUser) {
      throw new Error('This User already exists');
    }

    let user = await this.userRepository.createUser(data);

    this.eventDispatcher.dispatch('onUserCreate', user);

    return user;
  }

  public async updateOneById(id: number, data: UserUpdateRequest) {
    const user = await this.getRequestedUserOrFail(id);

    return await this.userRepository.updateUser(user, data);
  }

  public async updateProfilePicture(loggedUserId: number, image: any) {
    const client = await this.getRequestedUserOrFail(loggedUserId);
    if (!client) throw new Error('Client not Found!');
    if (!image) throw new Error('Image is required!');

    try {
      const result = (await cloudinary.uploader.upload_large(image, {
        folder: 'Profile Pictures',
      })) as UploadApiResponse;

      client.profile_photo_url = result.secure_url;
      await client.save();
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  public async deleteOneById(id: number) {
    return await this.userRepository.delete(id);
  }

  private async getRequestedUserOrFail(id: number, resourceOptions?: object) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.pricing_plan', 'plan')
      .select(['user', 'plan.id', 'plan.plan_name', 'plan.plan_description', 'plan.price', 'plan.billing_cycle'])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async getUsersBySearch(search: string) {
    const isSearchEmpty = !search || search.trim() === ',';

    const queryBuilder = this.userRepository.createQueryBuilder('User').leftJoinAndSelect('User.role', 'role');

    if (!isSearchEmpty) {
      const searchFields = ['first_name', 'last_name', 'email', 'role_name'];

      const orConditions = searchFields.map((field) => {
        return `${field} LIKE :search`;
      });

      const whereClause = `(${orConditions.join(' OR ')})`;
      const searchValue = `%${search}%`;

      queryBuilder.andWhere(whereClause, { search: searchValue });
    }

    queryBuilder.select(['User.id', 'User.username', 'User.first_name', 'User.last_name', 'User.email', 'User.phone', 'role.role_name']);

    const users = await queryBuilder.getMany();

    if (!users) {
      throw new UserNotFoundException();
    }
    return users;
  }
}
