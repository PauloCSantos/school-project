import CreateCurriculum from '../../usecases/curriculum/create.usecase';
import DeleteCurriculum from '../../usecases/curriculum/delete.usecase';
import FindAllCurriculum from '../../usecases/curriculum/find-all.usecase';
import FindCurriculum from '../../usecases/curriculum/find.usecase';
import RemoveSubjects from '../../usecases/curriculum/remove-subjects.usecase';
import UpdateCurriculum from '../../usecases/curriculum/update.usecase';
import CurriculumFacadeInterface from '../interface/curriculum.interface';
import AddSubjects from '../../usecases/curriculum/add-subjects.usecase';
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
