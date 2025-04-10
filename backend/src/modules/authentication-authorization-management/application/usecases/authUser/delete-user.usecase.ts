import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';

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
