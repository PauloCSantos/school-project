import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
} from '../../dto/authUser-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/authUser.gateway';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';

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
