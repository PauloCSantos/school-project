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
} from '../../dto/evaluation-facade.dto';
import CreateEvaluation from '../../usecases/evaluation/create.usecase';
import DeleteEvaluation from '../../usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../../usecases/evaluation/find-all.usecase';
import FindEvaluation from '../../usecases/evaluation/find.usecase';
import UpdateEvaluation from '../../usecases/evaluation/update.usecase';
import EvaluationFacadeInterface from '../interface/evaluation.interface';

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
