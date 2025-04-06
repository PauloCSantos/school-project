import UserMaster from '@/modules/user-management/domain/entity/user-master.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateUserMasterInputDto,
  CreateUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/infrastructure/gateway/user-master.gateway';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';

export default class CreateUserMaster
  implements
    UseCaseInterface<CreateUserMasterInputDto, CreateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(userMasterRepository: UserMasterGateway) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute({
    id,
    name,
    address,
    email,
    birthday,
    cnpj,
  }: CreateUserMasterInputDto): Promise<CreateUserMasterOutputDto> {
    const userMaster = new UserMaster({
      id: new Id(id),
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
