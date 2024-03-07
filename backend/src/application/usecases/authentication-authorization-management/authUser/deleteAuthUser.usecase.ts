import {
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AuthUserGateway from '@/infraestructure/gateway/authentication-authorization-management/authUser.gateway';

export default class DeleteAuthUser
  implements UseCaseInterface<DeleteAuthUserInputDto, DeleteAuthUserOutputDto>
{
  private _authUserRepository: AuthUserGateway;

  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }
  async execute({
    email,
  }: DeleteAuthUserInputDto): Promise<DeleteAuthUserOutputDto> {
    const authUserVerification = await this._authUserRepository.find(email);
    if (!authUserVerification) throw new Error('AuthUser not found');

    const result = await this._authUserRepository.delete(email);

    return { message: result };
  }
}
