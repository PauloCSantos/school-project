import {
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
} from '../../dto/curriculum-usecase.dto';

import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';
import CurriculumMapper from '../../mapper/curriculum.mapper';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

export default class RemoveSubjects
  implements UseCaseInterface<RemoveSubjectsInputDto, RemoveSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, subjectsListToRemove }: RemoveSubjectsInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<RemoveSubjectsOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.CURRICULUM,
        FunctionCalledEnum.REMOVE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');
    const curriculumObj = CurriculumMapper.toObj(curriculumVerification);
    const newCurriculum = JSON.parse(JSON.stringify(curriculumObj));
    const curriculum = new Curriculum({
      ...newCurriculum,
      id: new Id(newCurriculum.id),
    });
    try {
      subjectsListToRemove.forEach(subjectId => {
        curriculum.removeSubject(subjectId);
      });
      const result = await this._curriculumRepository.removeSubjects(
        id,
        subjectsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
