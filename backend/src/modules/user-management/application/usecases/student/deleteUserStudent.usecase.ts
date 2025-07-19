import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteUserStudent
  implements
    UseCaseInterface<DeleteUserStudentInputDto, DeleteUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { id }: DeleteUserStudentInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.STUDENT,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const userVerification = await this._userStudentRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userStudentRepository.delete(id);

    return { message: result };
  }
}
