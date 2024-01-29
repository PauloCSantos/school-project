import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
} from '@/application/dto/user-management/master-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';

import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import UserMasterGateway from '@/infraestructure/gateway/user-management-repository/user-master.gateway';
import UserMaster from '@/modules/user-management/domain/entity/user-master.entity';

export default class CreateUserMaster
  implements
    UseCaseInterface<CreateUserMasterInputDto, CreateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(userMasterRepository: UserMasterGateway) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute({
    name,
    address,
    email,
    birthday,
    cnpj,
  }: CreateUserMasterInputDto): Promise<CreateUserMasterOutputDto> {
    const userMaster = new UserMaster({
      name: new Name(name),
      address: new Address(address),
      email,
      birthday,
      cnpj,
    });

    const userVerification = await this._userMasterRepository.find(
      userMaster.id.id
    );
    if (userVerification) throw new Error('User already exists');

    const result = await this._userMasterRepository.create(userMaster);

    return { id: result };
  }
}
