import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';

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
