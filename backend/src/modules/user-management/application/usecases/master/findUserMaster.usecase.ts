import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserMasterInputDto,
  FindUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindUserMaster
  implements
    UseCaseInterface<FindUserMasterInputDto, FindUserMasterOutputDto | null>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { id }: FindUserMasterInputDto,
    token?: TokenData
  ): Promise<FindUserMasterOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.FIND,
      token
    );

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
