import {
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AuthUserGateway from '@/infraestructure/gateway/authentication-authorization-management/authUser.gateway';

export default class UpdateAuthUser
  implements UseCaseInterface<UpdateAuthUserInputDto, UpdateAuthUserOutputDto>
{
  private _authUserRepository: AuthUserGateway;

  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }
  async execute({
    authUserDataToUpdate,
    email,
  }: UpdateAuthUserInputDto): Promise<UpdateAuthUserOutputDto> {
    const authUser = await this._authUserRepository.find(email);
    if (!authUser) throw new Error('AuthUser not found');

    try {
      authUserDataToUpdate.password !== undefined &&
        (authUser.password = authUserDataToUpdate.password);
      authUserDataToUpdate.password !== undefined && authUser.hashPassword();
      authUserDataToUpdate.role !== undefined &&
        (authUser.role = authUserDataToUpdate.role);
      authUserDataToUpdate.email !== undefined &&
        (authUser.email = authUserDataToUpdate.email);

      const result = await this._authUserRepository.update(authUser, email);

      return {
        email: result.email,
        password: result.password,
        role: result.role as RoleUsers,
      };
    } catch (error) {
      throw error;
    }
  }
}
