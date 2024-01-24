import {
  DeleteUserAdministratorInputDto,
  DeleteUserAdministratorOutputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserAdministratorGateway from '@/modules/user-management/administrator/gateway/user-administrator.gateway';

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
