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
    const modifiedObj = Object.create(authUser);

    try {
      authUserDataToUpdate.password !== undefined &&
        (modifiedObj.password = authUserDataToUpdate.password);
      authUserDataToUpdate.password !== undefined && modifiedObj.hashPassword();
      authUserDataToUpdate.role !== undefined &&
        (modifiedObj.role = authUserDataToUpdate.role);
      authUserDataToUpdate.email !== undefined &&
        (modifiedObj.email = authUserDataToUpdate.email);

      const result = await this._authUserRepository.update(modifiedObj, email);

      return {
        email: result.email,
        role: result.role as RoleUsers,
      };
    } catch (error) {
      throw error;
    }
  }
}
