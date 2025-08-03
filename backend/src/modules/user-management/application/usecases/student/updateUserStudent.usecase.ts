import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateUserStudentInputDto,
  UpdateUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class UpdateUserStudent
  implements
    UseCaseInterface<UpdateUserStudentInputDto, UpdateUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    {
      id,
      name,
      address,
      email,
      birthday,
      paymentYear,
    }: UpdateUserStudentInputDto,
    token?: TokenData
  ): Promise<UpdateUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.UPDATE,
      token
    );

    const userStudent = await this._userStudentRepository.find(id);
    if (!userStudent) throw new Error('User not found');

    try {
      name?.firstName !== undefined &&
        (userStudent.name.firstName = name.firstName);
      name?.middleName !== undefined &&
        (userStudent.name.middleName = name.middleName);
      name?.lastName !== undefined &&
        (userStudent.name.lastName = name.lastName);
      address?.street !== undefined &&
        (userStudent.address.street = address.street);
      address?.city !== undefined && (userStudent.address.city = address.city);
      address?.zip !== undefined && (userStudent.address.zip = address.zip);
      address?.number !== undefined &&
        (userStudent.address.number = address.number);
      address?.avenue !== undefined &&
        (userStudent.address.avenue = address.avenue);
      address?.state !== undefined &&
        (userStudent.address.state = address.state);
      email !== undefined && (userStudent.email = email);
      birthday !== undefined && (userStudent.birthday = new Date(birthday));
      paymentYear !== undefined && (userStudent.paymentYear = paymentYear);

      const result = await this._userStudentRepository.update(userStudent);

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
        paymentYear: result.paymentWithCurrencyBR(),
      };
    } catch (error) {
      throw error;
    }
  }
}
