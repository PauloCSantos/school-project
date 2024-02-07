import {
  CreateCurriculumInputDto,
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
  CreateCurriculumOutputDto,
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
  FindCurriculumInputDto,
  FindCurriculumOutputDto,
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';

export class CurriculumController {
  constructor(
    private readonly createCurriculum: CreateCurriculum,
    private readonly findCurriculum: FindCurriculum,
    private readonly findAllCurriculum: FindAllCurriculum,
    private readonly updateCurriculum: UpdateCurriculum,
    private readonly deleteCurriculum: DeleteCurriculum,
    private readonly addSubjectstoCurriculum: AddSubjects,
    private readonly removeSubjectstoCurriculum: RemoveSubjects
  ) {}

  async create(
    input: CreateCurriculumInputDto
  ): Promise<CreateCurriculumOutputDto> {
    const response = await this.createCurriculum.execute(input);
    return response;
  }
  async find(
    input: FindCurriculumInputDto
  ): Promise<FindCurriculumOutputDto | undefined> {
    const response = await this.findCurriculum.execute(input);
    return response;
  }
  async findAll(
    input: FindAllCurriculumInputDto
  ): Promise<FindAllCurriculumOutputDto> {
    const response = await this.findAllCurriculum.execute(input);
    return response;
  }
  async delete(
    input: DeleteCurriculumInputDto
  ): Promise<DeleteCurriculumOutputDto> {
    const response = await this.deleteCurriculum.execute(input);
    return response;
  }
  async update(
    input: UpdateCurriculumInputDto
  ): Promise<UpdateCurriculumOutputDto> {
    const response = await this.updateCurriculum.execute(input);
    return response;
  }
  async addSubjects(input: AddSubjectsInputDto): Promise<AddSubjectsOutputDto> {
    const response = await this.addSubjectstoCurriculum.execute(input);
    return response;
  }
  async removeSubjects(
    input: RemoveSubjectsInputDto
  ): Promise<RemoveSubjectsOutputDto> {
    const response = await this.removeSubjectstoCurriculum.execute(input);
    return response;
  }
}
