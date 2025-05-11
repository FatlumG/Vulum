import { Service } from 'typedi';
import { UserRepository } from '@api/repositories/Users/UserRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { InvalidCredentials } from '@api/exceptions/Auth/InvalidCredentials';
import { AuthService } from '@base/infrastructure/services/auth/AuthService';
import { LoginRequest } from '@base/api/requests/Auth/LoginRequest';
import { HashService } from '@base/infrastructure/services/hash/HashService';

@Service()
export class LoginService {
  constructor(@InjectRepository() private userRepository: UserRepository, private authService: AuthService, private hashService: HashService) {
    //
  }

  public async login(data: LoginRequest) {
    let user = await this.userRepository.findOne({
      where: { Email: data.Email },
      relations: ['role'],
    });
    console.log(user, 'User Object');
    
    if (!user) {
      console.log('User not found');
      throw new InvalidCredentials();
    }

    if (!(await this.hashService.compare(data.Password, user.Password))) {
      throw new InvalidCredentials();
    }

    return this.authService.sign(
      {
        userId: user.id,
        email: user.Email,
        role_id: user.RoleId,
        role: user.role.RoleName,
      },
      { user: { id: user.id, email: user.Email, role: user.role.RoleName } },
    );
  }
}
