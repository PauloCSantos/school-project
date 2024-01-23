import {
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '@/application/dto/user-management/master-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserMasterGateway from '@/modules/user-management/master/gateway/user-master.gateway';

export default class UpdateUserMaster
  implements
    UseCaseInterface<UpdateUserMasterInputDto, UpdateUserMasterOutputDto>
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
  }: UpdateUserMasterInputDto): Promise<UpdateUserMasterOutputDto> {
    const userMaster = await this._userMasterRepository.find(id);
    if (!userMaster) throw new Error('User not found');

    name?.firstName && (userMaster.name.firstName = name.firstName);
    name?.middleName && (userMaster.name.middleName = name.middleName);
    name?.lastName && (userMaster.name.lastName = name.lastName);
    address?.street && (userMaster.address.street = address.street);
    address?.city && (userMaster.address.city = address.city);
    address?.zip && (userMaster.address.zip = address.zip);
    address?.number && (userMaster.address.number = address.number);
    address?.avenue && (userMaster.address.avenue = address.avenue);
    address?.state && (userMaster.address.state = address.state);
    email && (userMaster.email = email);
    birthday && (userMaster.birthday = birthday);
    cnpj && (userMaster.cnpj = cnpj);

    const result = await this._userMasterRepository.update(userMaster);

    return {
      name: {
        fullName: result.name.fullName(),
        shortName: result.name.shortName(),
      },
      address: {
        street: result.address.street,
        city: result.address.city,
        zip: result.address.zip,
        number: result.address.number,
        avenue: result.address.avenue,
        state: result.address.state,
      },
      email: result.email,
      birthday: result.birthday,
      cnpj: result.cnpj,
    };
  }
}
