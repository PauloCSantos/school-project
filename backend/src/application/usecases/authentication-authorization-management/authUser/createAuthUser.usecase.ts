import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';
import AuthUserGateway from '@/infraestructure/gateway/authentication-authorization-management/authUser.gateway';

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

      return { email: result };
    } catch (error) {
      throw error;
    }
  }
}
