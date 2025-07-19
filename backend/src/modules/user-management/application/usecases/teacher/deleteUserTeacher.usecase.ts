import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserTeacherInputDto,
  DeleteUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteUserTeacher
  implements
    UseCaseInterface<DeleteUserTeacherInputDto, DeleteUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { id }: DeleteUserTeacherInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteUserTeacherOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.TEACHER,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const userVerification = await this._userTeacherRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userTeacherRepository.delete(id);

    return { message: result };
  }
}
