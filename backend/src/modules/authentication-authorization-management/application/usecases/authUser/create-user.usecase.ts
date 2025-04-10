import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/user-entity.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';

export default class CreateAuthUser
  implements UseCaseInterface<CreateAuthUserInputDto, CreateAuthUserOutputDto>
{
  private _authUserRepository: AuthUserGateway;

  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }
  async execute({
    email,
    password,
    role,
    masterId,
    isHashed,
  }: CreateAuthUserInputDto): Promise<CreateAuthUserOutputDto> {
    try {
      const authUserService = new AuthUserService();
      const authUser = new AuthUser(
        {
          email,
          password,
          role,
          masterId,
          isHashed,
        },
        authUserService
      );

      const authUserVerification = await this._authUserRepository.find(
        authUser.email
      );
      if (authUserVerification) throw new Error('AuthUser already exists');
      await authUser.hashPassword();
      const result = await this._authUserRepository.create(authUser);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
