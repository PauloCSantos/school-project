import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserStudentInputDto,
  FindAllUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class FindAllUserStudent
  implements
    UseCaseInterface<FindAllUserStudentInputDto, FindAllUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { offset, quantity }: FindAllUserStudentInputDto,
    token?: TokenData
  ): Promise<FindAllUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const results = await this._userStudentRepository.findAll(quantity, offset);

    const result = results.map(userStudent => ({
      id: userStudent.id.value,
      name: {
        fullName: userStudent.name.fullName(),
        shortName: userStudent.name.shortName(),
      },
      address: {
        street: userStudent.address.street,
        city: userStudent.address.city,
        zip: userStudent.address.zip,
        number: userStudent.address.number,
        avenue: userStudent.address.avenue,
        state: userStudent.address.state,
      },
      email: userStudent.email,
      birthday: userStudent.birthday,
      paymentYear: userStudent.paymentWithCurrencyBR(),
    }));

    return result;
  }
}
