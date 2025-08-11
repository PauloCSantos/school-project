import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class DeleteUserStudent
  implements
    UseCaseInterface<DeleteUserStudentInputDto, DeleteUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { id }: DeleteUserStudentInputDto,
    token?: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.DELETE,
      token
    );

    const userVerification = await this._userStudentRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userStudentRepository.delete(id);

    return { message: result };
  }
}
