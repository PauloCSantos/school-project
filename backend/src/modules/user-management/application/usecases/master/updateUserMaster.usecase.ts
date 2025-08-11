import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserMasterInputDto,
  UpdateUserMasterOutputDto,
} from '../../dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class UpdateUserMaster
  implements
    UseCaseInterface<UpdateUserMasterInputDto, UpdateUserMasterOutputDto>
{
  private _userMasterRepository: UserMasterGateway;

  constructor(
    userMasterRepository: UserMasterGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userMasterRepository = userMasterRepository;
  }
  async execute(
    { id, name, address, email, birthday, cnpj }: UpdateUserMasterInputDto,
    token?: TokenData
  ): Promise<UpdateUserMasterOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.MASTER,
      FunctionCalledEnum.UPDATE,
      token
    );

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
      birthday !== undefined && (userMaster.birthday = new Date(birthday));
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
