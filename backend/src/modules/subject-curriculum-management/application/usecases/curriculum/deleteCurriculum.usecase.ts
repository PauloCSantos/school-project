import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
} from '../../dto/curriculum-usecase.dto';
import CurriculumGateway from '@/modules/subject-curriculum-management/infrastructure/gateway/curriculum.gateway';

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
