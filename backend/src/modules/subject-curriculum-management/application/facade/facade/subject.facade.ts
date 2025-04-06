import DeleteSubject from '../../usecases/subject/deleteSubject.usecase';
import FindAllSubject from '../../usecases/subject/findAllSubject.usecase';
import FindSubject from '../../usecases/subject/findSubject.usecase';
import UpdateSubject from '../../usecases/subject/updateSubject.usecase';
import SubjectFacadeInterface from '../interface/subject-facade.interface';
import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
  FindSubjectInputDto,
  FindSubjectOutputDto,
  UpdateSubjectInputDto,
  UpdateSubjectOutputDto,
} from '../../dto/subject-facade.dto';
import CreateSubject from '../../usecases/subject/createSubject.usecase';

type SubjectFacadeProps = {
  createSubject: CreateSubject;
  deleteSubject: DeleteSubject;
  findAllSubject: FindAllSubject;
  findSubject: FindSubject;
  updateSubject: UpdateSubject;
};
export default class SubjectFacade implements SubjectFacadeInterface {
  private _createSubject: CreateSubject;
  private _deleteSubject: DeleteSubject;
  private _findAllSubject: FindAllSubject;
  private _findSubject: FindSubject;
  private _updateSubject: UpdateSubject;

  constructor(input: SubjectFacadeProps) {
    this._createSubject = input.createSubject;
    this._deleteSubject = input.deleteSubject;
    this._findAllSubject = input.findAllSubject;
    this._findSubject = input.findSubject;
    this._updateSubject = input.updateSubject;
  }

  async create(input: CreateSubjectInputDto): Promise<CreateSubjectOutputDto> {
    return await this._createSubject.execute(input);
  }
  async find(
    input: FindSubjectInputDto
  ): Promise<FindSubjectOutputDto | undefined> {
    return await this._findSubject.execute(input);
  }
  async findAll(
    input: FindAllSubjectInputDto
  ): Promise<FindAllSubjectOutputDto> {
    return await this._findAllSubject.execute(input);
  }
  async delete(input: DeleteSubjectInputDto): Promise<DeleteSubjectOutputDto> {
    return await this._deleteSubject.execute(input);
  }
  async update(input: UpdateSubjectInputDto): Promise<UpdateSubjectOutputDto> {
    return await this._updateSubject.execute(input);
  }
}
