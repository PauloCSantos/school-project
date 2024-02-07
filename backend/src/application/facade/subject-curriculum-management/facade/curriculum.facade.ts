import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';
import CurriculumFacadeInterface from '../interface/curriculum-facade.interface';
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
} from '@/application/dto/subject-curriculum-management/curriculum-facade.dto';

type CurriculumFacadeProps = {
  createCurriculum: CreateCurriculum;
  deleteCurriculum: DeleteCurriculum;
  findAllCurriculum: FindAllCurriculum;
  findCurriculum: FindCurriculum;
  updateCurriculum: UpdateCurriculum;
  addSubjects: AddSubjects;
  removeSubjects: RemoveSubjects;
};
export default class CurriculumFacade implements CurriculumFacadeInterface {
  private _createCurriculum: CreateCurriculum;
  private _deleteCurriculum: DeleteCurriculum;
  private _findAllCurriculum: FindAllCurriculum;
  private _findCurriculum: FindCurriculum;
  private _updateCurriculum: UpdateCurriculum;
  private _addSubjects: AddSubjects;
  private _removeSubjects: RemoveSubjects;

  constructor(input: CurriculumFacadeProps) {
    this._createCurriculum = input.createCurriculum;
    this._deleteCurriculum = input.deleteCurriculum;
    this._findAllCurriculum = input.findAllCurriculum;
    this._findCurriculum = input.findCurriculum;
    this._updateCurriculum = input.updateCurriculum;
    this._addSubjects = input.addSubjects;
    this._removeSubjects = input.removeSubjects;
  }

  async create(
    input: CreateCurriculumInputDto
  ): Promise<CreateCurriculumOutputDto> {
    return await this._createCurriculum.execute(input);
  }
  async find(
    input: FindCurriculumInputDto
  ): Promise<FindCurriculumOutputDto | undefined> {
    return await this._findCurriculum.execute(input);
  }
  async findAll(
    input: FindAllCurriculumInputDto
  ): Promise<FindAllCurriculumOutputDto> {
    return await this._findAllCurriculum.execute(input);
  }
  async delete(
    input: DeleteCurriculumInputDto
  ): Promise<DeleteCurriculumOutputDto> {
    return await this._deleteCurriculum.execute(input);
  }
  async update(
    input: UpdateCurriculumInputDto
  ): Promise<UpdateCurriculumOutputDto> {
    return await this._updateCurriculum.execute(input);
  }
  async addSubjects(input: AddSubjectsInputDto): Promise<AddSubjectsOutputDto> {
    return await this._addSubjects.execute(input);
  }
  async removeSubjects(
    input: RemoveSubjectsInputDto
  ): Promise<RemoveSubjectsOutputDto> {
    return await this._removeSubjects.execute(input);
  }
}
