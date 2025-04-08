import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/infrastructure/gateway/user-master.gateway';

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

    try {
      name?.firstName !== undefined &&
        (userMaster.name.firstName = name.firstName);
      name?.middleName !== undefined &&
        (userMaster.name.middleName = name.middleName);
      name?.lastName !== undefined &&
        (userMaster.name.lastName = name.lastName);
      address?.street !== undefined &&
        (userMaster.address.street = address.street);
      address?.city !== undefined && (userMaster.address.city = address.city);
      address?.zip !== undefined && (userMaster.address.zip = address.zip);
      address?.number !== undefined &&
        (userMaster.address.number = address.number);
      address?.avenue !== undefined &&
        (userMaster.address.avenue = address.avenue);
      address?.state !== undefined &&
        (userMaster.address.state = address.state);
      email !== undefined && (userMaster.email = email);
      birthday !== undefined && (userMaster.birthday = birthday);
      cnpj !== undefined && (userMaster.cnpj = cnpj);

      const result = await this._userMasterRepository.update(userMaster);

      return {
        id: result.id.value,
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
    } catch (error) {
      throw error;
    }
  }
}
