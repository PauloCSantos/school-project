import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
  CreateCurriculumInputDto,
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
} from '../../dto/curriculum-facade.dto';

export default interface CurriculumFacadeInterface {
  create(input: CreateCurriculumInputDto): Promise<CreateCurriculumOutputDto>;
  find(
    input: FindCurriculumInputDto
  ): Promise<FindCurriculumOutputDto | undefined>;
  findAll(
    input: FindAllCurriculumInputDto
  ): Promise<FindAllCurriculumOutputDto>;
  delete(input: DeleteCurriculumInputDto): Promise<DeleteCurriculumOutputDto>;
  update(input: UpdateCurriculumInputDto): Promise<UpdateCurriculumOutputDto>;
  addSubjects(input: AddSubjectsInputDto): Promise<AddSubjectsOutputDto>;
  removeSubjects(
    input: RemoveSubjectsInputDto
  ): Promise<RemoveSubjectsOutputDto>;
}
