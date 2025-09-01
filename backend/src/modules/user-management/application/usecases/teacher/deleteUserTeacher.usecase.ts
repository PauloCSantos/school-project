import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserTeacherInputDto,
  DeleteUserTeacherOutputDto,
} from '../../../application/dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';
import { UserNotFoundError } from '../../errors/user-not-found.error';

export default class DeleteUserTeacher
  implements UseCaseInterface<DeleteUserTeacherInputDto, DeleteUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { id }: DeleteUserTeacherInputDto,
    token: TokenData
  ): Promise<DeleteUserTeacherOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.DELETE,
      token
    );

    const userTeacher = await this._userTeacherRepository.find(token.masterId, id);
    if (!userTeacher) throw new UserNotFoundError(RoleUsersEnum.TEACHER, id);
    userTeacher.deactivate();

    const result = await this._userTeacherRepository.delete(token.masterId, userTeacher);

    return { message: result };
  }
}
