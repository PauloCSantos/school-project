import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
} from '../../../application/dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { StudentAssembler } from '../../assemblers/student.assembler';

export default class FindUserStudent
  implements UseCaseInterface<FindUserStudentInputDto, FindUserStudentOutputDto | null>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(
    userStudentRepository: UserStudentGateway,
    private readonly policiesService: PoliciesServiceInterface,
    private readonly userService: UserServiceInterface
  ) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute(
    { id }: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._userStudentRepository.find(token.masterId, id);
    if (response) {
      const baseUser = await this.userService.findBaseUser(response.userId);
      return StudentAssembler.toObj(baseUser!, response);
    }
    return null;
  }
}
