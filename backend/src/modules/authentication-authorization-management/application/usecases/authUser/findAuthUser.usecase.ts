import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
} from '../../dto/authUser-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/authUser.gateway';

export default class FindAuthUser
  implements
    UseCaseInterface<FindAuthUserInputDto, FindAuthUserOutputDto | undefined>
{
  private _authUserRepository: AuthUserGateway;

  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }
  async execute({
    email,
  }: FindAuthUserInputDto): Promise<FindAuthUserOutputDto | undefined> {
    const response = await this._authUserRepository.find(email);
    if (response) {
      return {
        email: response.email,
        masterId: response.masterId,
        role: response.role as RoleUsers,
        isHashed: true,
      };
    } else {
      return response;
    }
  }
}
