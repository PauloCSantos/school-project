import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class DeleteCurriculum
  implements
    UseCaseInterface<DeleteCurriculumInputDto, DeleteCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id }: DeleteCurriculumInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteCurriculumOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');

    const result = await this._curriculumRepository.delete(id);

    return { message: result };
  }
}
