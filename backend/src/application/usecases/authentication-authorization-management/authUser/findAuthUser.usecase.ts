import {
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AuthUserGateway from '@/infraestructure/gateway/authentication-authorization-management/authUser.gateway';

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
