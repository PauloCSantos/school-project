import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import CurriculumMapper from '../../mapper/curriculum.mapper';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

export default class AddSubjects
  implements UseCaseInterface<AddSubjectsInputDto, AddSubjectsOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(
    curriculumRepository: CurriculumGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute(
    { id, newSubjectsList }: AddSubjectsInputDto,
    token?: TokenData
  ): Promise<AddSubjectsOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.CURRICULUM,
      FunctionCalledEnum.ADD,
      token
    );

    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');
    const curriculumObj = CurriculumMapper.toObj(curriculumVerification);
    const newCurriculum = JSON.parse(JSON.stringify(curriculumObj));
    const curriculum = new Curriculum({
      ...newCurriculum,
      id: new Id(newCurriculum.id),
    });
    try {
      newSubjectsList.forEach(subjectId => {
        curriculum.addSubject(subjectId);
      });
      const result = await this._curriculumRepository.addSubjects(
        id,
        newSubjectsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
