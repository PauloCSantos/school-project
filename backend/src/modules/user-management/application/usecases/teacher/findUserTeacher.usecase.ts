import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserTeacherInputDto,
  FindUserTeacherOutputDto,
} from '../../../application/dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { TeacherAssembler } from '../../assemblers/teacher.assembler';

export default class FindUserTeacher
  implements UseCaseInterface<FindUserTeacherInputDto, FindUserTeacherOutputDto | null>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(
    userTeacherRepository: UserTeacherGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute(
    { id }: FindUserTeacherInputDto,
    token: TokenData
  ): Promise<FindUserTeacherOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.TEACHER,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userTeacherRepository.find(token.masterId, id);
    if (response) {
      const baseUser = await this.userService.findBaseUser(response.userId);
      return TeacherAssembler.toObj(baseUser!, response);
    }
    return null;
  }
}
