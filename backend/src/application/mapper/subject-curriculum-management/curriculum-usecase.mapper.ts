import { FindCurriculumOutputDto } from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

type CurriculumMapperProps = FindCurriculumOutputDto & {
  id: string;
};
export default class CurriculumMapper {
  static toObj(input: Curriculum): CurriculumMapperProps {
    return {
      id: input.id.id,
      name: input.name,
      yearsToComplete: input.yearsToComplete,
      subjectsList: input.subjectList,
    };
  }
  static toInstance(input: CurriculumMapperProps): Curriculum {
    return new Curriculum({
      id: new Id(input.id),
      name: input.name,
      yearsToComplete: input.yearsToComplete,
      subjectsList: input.subjectsList,
    });
  }
}
