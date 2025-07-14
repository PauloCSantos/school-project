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
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type CurriculumFacadeProps = {
  readonly createCurriculum: CreateCurriculum;
  readonly deleteCurriculum: DeleteCurriculum;
  readonly findAllCurriculum: FindAllCurriculum;
  readonly findCurriculum: FindCurriculum;
  readonly updateCurriculum: UpdateCurriculum;
  readonly addSubjects: AddSubjects;
  readonly removeSubjects: RemoveSubjects;
  readonly policiesService: PoliciesServiceInterface;
};
export default class CurriculumFacade implements CurriculumFacadeInterface {
  private readonly _createCurriculum: CreateCurriculum;
  private readonly _deleteCurriculum: DeleteCurriculum;
  private readonly _findAllCurriculum: FindAllCurriculum;
  private readonly _findCurriculum: FindCurriculum;
  private readonly _updateCurriculum: UpdateCurriculum;
  private readonly _addSubjects: AddSubjects;
  private readonly _removeSubjects: RemoveSubjects;
  private readonly _policiesService: PoliciesServiceInterface;

  constructor(input: CurriculumFacadeProps) {
    this._createCurriculum = input.createCurriculum;
    this._deleteCurriculum = input.deleteCurriculum;
    this._findAllCurriculum = input.findAllCurriculum;
    this._findCurriculum = input.findCurriculum;
    this._updateCurriculum = input.updateCurriculum;
    this._addSubjects = input.addSubjects;
    this._removeSubjects = input.removeSubjects;
    this._policiesService = input.policiesService;
  }

  async create(
    input: CreateCurriculumInputDto,
    token: TokenData
  ): Promise<CreateCurriculumOutputDto> {
    return await this._createCurriculum.execute(
      input,
      this._policiesService,
      token
    );
  }
  async find(
    input: FindCurriculumInputDto,
    token: TokenData
  ): Promise<FindCurriculumOutputDto | null> {
    return await this._findCurriculum.execute(
      input,
      this._policiesService,
      token
    );
  }
  async findAll(
    input: FindAllCurriculumInputDto,
    token: TokenData
  ): Promise<FindAllCurriculumOutputDto> {
    return await this._findAllCurriculum.execute(
      input,
      this._policiesService,
      token
    );
  }
  async delete(
    input: DeleteCurriculumInputDto,
    token: TokenData
  ): Promise<DeleteCurriculumOutputDto> {
    return await this._deleteCurriculum.execute(
      input,
      this._policiesService,
      token
    );
  }
  async update(
    input: UpdateCurriculumInputDto,
    token: TokenData
  ): Promise<UpdateCurriculumOutputDto> {
    return await this._updateCurriculum.execute(
      input,
      this._policiesService,
      token
    );
  }
  async addSubjects(
    input: AddSubjectsInputDto,
    token: TokenData
  ): Promise<AddSubjectsOutputDto> {
    return await this._addSubjects.execute(input, this._policiesService, token);
  }
  async removeSubjects(
    input: RemoveSubjectsInputDto,
    token: TokenData
  ): Promise<RemoveSubjectsOutputDto> {
    return await this._removeSubjects.execute(
      input,
      this._policiesService,
      token
    );
  }
}
