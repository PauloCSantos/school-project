import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllUserStudentInputDto,
  FindAllUserStudentOutputDto,
} from '../../../application/dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/application/gateway/student.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';
import { StudentAssembler } from '../../assemblers/student.assembler';

export default class FindAllUserStudent
  implements UseCaseInterface<FindAllUserStudentInputDto, FindAllUserStudentOutputDto>
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
    { offset, quantity }: FindAllUserStudentInputDto,
    token: TokenData
  ): Promise<FindAllUserStudentOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.STUDENT,
      FunctionCalledEnum.FIND_ALL,
      token
    );

    const students = await this._userStudentRepository.findAll(
      token.masterId,
      quantity,
      offset
    );

    const results = await this.userService.findBaseUsers(students);

    return StudentAssembler.toObjList(results);
  }
}
