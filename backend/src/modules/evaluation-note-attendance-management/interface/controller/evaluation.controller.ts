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
} from '../../application/dto/evaluation-usecase.dto';
import CreateEvaluation from '../../application/usecases/evaluation/create.usecase';
import DeleteEvaluation from '../../application/usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../../application/usecases/evaluation/find-all.usecase';
import FindEvaluation from '../../application/usecases/evaluation/find.usecase';
import UpdateEvaluation from '../../application/usecases/evaluation/update.usecase';

export class EvaluationController {
  constructor(
    private readonly createEvaluation: CreateEvaluation,
    private readonly findEvauation: FindEvaluation,
    private readonly findAllEvauation: FindAllEvaluation,
    private readonly updateEvauation: UpdateEvaluation,
    private readonly deleteEvauation: DeleteEvaluation
  ) {}

  async create(
    input: CreateEvaluationInputDto
  ): Promise<CreateEvaluationOutputDto> {
    const response = await this.createEvaluation.execute(input);
    return response;
  }
  async find(
    input: FindEvaluationInputDto
  ): Promise<FindEvaluationOutputDto | undefined> {
    const response = await this.findEvauation.execute(input);
    return response;
  }
  async findAll(
    input: FindAllEvaluationInputDto
  ): Promise<FindAllEvaluationOutputDto> {
    const response = await this.findAllEvauation.execute(input);
    return response;
  }
  async delete(
    input: DeleteEvaluationInputDto
  ): Promise<DeleteEvaluationOutputDto> {
    const response = await this.deleteEvauation.execute(input);
    return response;
  }
  async update(
    input: UpdateEvaluationInputDto
  ): Promise<UpdateEvaluationOutputDto> {
    const response = await this.updateEvauation.execute(input);
    return response;
  }
}
