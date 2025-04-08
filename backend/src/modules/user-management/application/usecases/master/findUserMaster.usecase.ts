import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/infrastructure/gateway/user-master.gateway';

export default class FindUserMaster
  implements
    UseCaseInterface<
      FindUserMasterInputDto,
      FindUserMasterOutputDto | undefined
    >
{
  private _userMasterRepository: UserMasterGateway;

  constructor(userMasterRepository: UserMasterGateway) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute({
    id,
  }: FindUserMasterInputDto): Promise<FindUserMasterOutputDto | undefined> {
    const response = await this._userMasterRepository.find(id);
    if (response) {
      return {
        id: response.id.value,
        name: {
          fullName: response.name.fullName(),
          shortName: response.name.shortName(),
        },
        address: {
          street: response.address.street,
          city: response.address.city,
          zip: response.address.zip,
          number: response.address.number,
          avenue: response.address.avenue,
          state: response.address.state,
        },
        email: response.email,
        birthday: response.birthday,
        cnpj: response.cnpj,
      };
    } else {
      return response;
    }
  }
}
