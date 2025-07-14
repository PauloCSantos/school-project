import CreateSubject from '../../usecases/subject/create.usecase';
import DeleteSubject from '../../usecases/subject/delete.usecase';
import FindAllSubject from '../../usecases/subject/find-all.usecase';
import FindSubject from '../../usecases/subject/find.usecase';
import UpdateSubject from '../../usecases/subject/update.usecase';
import SubjectFacadeInterface from '../interface/subject.interface';
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
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type SubjectFacadeProps = {
  readonly createSubject: CreateSubject;
  readonly deleteSubject: DeleteSubject;
  readonly findAllSubject: FindAllSubject;
  readonly findSubject: FindSubject;
  readonly updateSubject: UpdateSubject;
  readonly policiesService: PoliciesServiceInterface;
};
export default class SubjectFacade implements SubjectFacadeInterface {
  private readonly _createSubject: CreateSubject;
  private readonly _deleteSubject: DeleteSubject;
  private readonly _findAllSubject: FindAllSubject;
  private readonly _findSubject: FindSubject;
  private readonly _updateSubject: UpdateSubject;
  private readonly _policiesService: PoliciesServiceInterface;

  constructor(input: SubjectFacadeProps) {
    this._createSubject = input.createSubject;
    this._deleteSubject = input.deleteSubject;
    this._findAllSubject = input.findAllSubject;
    this._findSubject = input.findSubject;
    this._updateSubject = input.updateSubject;
    this._policiesService = input.policiesService;
  }

  async create(
    input: CreateSubjectInputDto,
    token: TokenData
  ): Promise<CreateSubjectOutputDto> {
    return await this._createSubject.execute(
      input,
      this._policiesService,
      token
    );
  }
  async find(
    input: FindSubjectInputDto,
    token: TokenData
  ): Promise<FindSubjectOutputDto | null> {
    return await this._findSubject.execute(input, this._policiesService, token);
  }
  async findAll(
    input: FindAllSubjectInputDto,
    token: TokenData
  ): Promise<FindAllSubjectOutputDto> {
    return await this._findAllSubject.execute(
      input,
      this._policiesService,
      token
    );
  }
  async delete(
    input: DeleteSubjectInputDto,
    token: TokenData
  ): Promise<DeleteSubjectOutputDto> {
    return await this._deleteSubject.execute(
      input,
      this._policiesService,
      token
    );
  }
  async update(
    input: UpdateSubjectInputDto,
    token: TokenData
  ): Promise<UpdateSubjectOutputDto> {
    return await this._updateSubject.execute(
      input,
      this._policiesService,
      token
    );
  }
}
