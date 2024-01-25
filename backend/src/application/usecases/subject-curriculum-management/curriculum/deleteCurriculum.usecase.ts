import {
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import CurriculumGateway from '@/modules/subject-curriculum-management/curriculum/gateway/curriculum.gateway';

export default class DeleteCurriculum
  implements
    UseCaseInterface<DeleteCurriculumInputDto, DeleteCurriculumOutputDto>
{
  private _curriculumRepository: CurriculumGateway;

  constructor(curriculumRepository: CurriculumGateway) {
    this._curriculumRepository = curriculumRepository;
  }
  async execute({
    id,
  }: DeleteCurriculumInputDto): Promise<DeleteCurriculumOutputDto> {
    const curriculumVerification = await this._curriculumRepository.find(id);
    if (!curriculumVerification) throw new Error('Curriculum not found');

    const result = await this._curriculumRepository.delete(id);

    return { message: result };
  }
}
