import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import EvaluationFacadeInterface from '../interface/evaluation-facade.interface';
import {
  CreateEvaluationInputDto,
  CreateEvaluationOutputDto,
  DeleteEvaluationInputDto,
  DeleteEvaluationOutputDto,
  FindAllEvaluationInputDto,
  FindAllEvaluationOutputDto,
  FindEvaluationInputDto,
  FindEvaluationOutputDto,
  UpdateEvaluationInputDto,
  UpdateEvaluationOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-facade.dto';

type EvaluationFacadeProps = {
  createEvaluation: CreateEvaluation;
  deleteEvaluation: DeleteEvaluation;
  findAllEvaluation: FindAllEvaluation;
  findEvaluation: FindEvaluation;
  updateEvaluation: UpdateEvaluation;
};
export default class EvaluationFacade implements EvaluationFacadeInterface {
  private _createEvaluation: CreateEvaluation;
  private _deleteEvaluation: DeleteEvaluation;
  private _findAllEvaluation: FindAllEvaluation;
  private _findEvaluation: FindEvaluation;
  private _updateEvaluation: UpdateEvaluation;

  constructor(input: EvaluationFacadeProps) {
    this._createEvaluation = input.createEvaluation;
    this._deleteEvaluation = input.deleteEvaluation;
    this._findAllEvaluation = input.findAllEvaluation;
    this._findEvaluation = input.findEvaluation;
    this._updateEvaluation = input.updateEvaluation;
  }

  async create(
    input: CreateEvaluationInputDto
  ): Promise<CreateEvaluationOutputDto> {
    return await this._createEvaluation.execute(input);
  }
  async find(
    input: FindEvaluationInputDto
  ): Promise<FindEvaluationOutputDto | undefined> {
    return await this._findEvaluation.execute(input);
  }
  async findAll(
    input: FindAllEvaluationInputDto
  ): Promise<FindAllEvaluationOutputDto> {
    return await this._findAllEvaluation.execute(input);
  }
  async delete(
    input: DeleteEvaluationInputDto
  ): Promise<DeleteEvaluationOutputDto> {
    return await this._deleteEvaluation.execute(input);
  }
  async update(
    input: UpdateEvaluationInputDto
  ): Promise<UpdateEvaluationOutputDto> {
    return await this._updateEvaluation.execute(input);
  }
}
