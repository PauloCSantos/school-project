import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
} from '../../../application/dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';
import { UserNotFoundError } from '../../errors/user-not-found.error';

export default class DeleteUserStudent
  implements UseCaseInterface<DeleteUserStudentInputDto, DeleteUserStudentOutputDto>
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
    token: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.DELETE,
      token
    );

    const userStudent = await this._userStudentRepository.find(token.masterId, id);
    if (!userStudent) throw new UserNotFoundError(RoleUsersEnum.STUDENT, id);
    userStudent.deactivate();

    const result = await this._userStudentRepository.delete(token.masterId, userStudent);

    return { message: result };
  }
}
