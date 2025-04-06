import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
} from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '@/modules/user-management/infrastructure/gateway/user-administrator.gateway';

export default class DeleteUserAdministrator
  implements
    UseCaseInterface<
      DeleteUserAdministratorInputDto,
      DeleteUserAdministratorOutputDto
    >
{
  private _userAdministratorRepository: UserAdministratorGateway;

  constructor(userAdministratorRepository: UserAdministratorGateway) {
    this._userAdministratorRepository = userAdministratorRepository;
  }
  async execute({
    id,
  }: DeleteUserAdministratorInputDto): Promise<DeleteUserAdministratorOutputDto> {
    const userVerification = await this._userAdministratorRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userAdministratorRepository.delete(id);

    return { message: result };
  }
}
