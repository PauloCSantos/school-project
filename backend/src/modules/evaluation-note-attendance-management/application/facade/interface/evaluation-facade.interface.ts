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

export default interface EvaluationFacadeInterface {
  create(input: CreateEvaluationInputDto): Promise<CreateEvaluationOutputDto>;
  find(
    input: FindEvaluationInputDto
  ): Promise<FindEvaluationOutputDto | undefined>;
  findAll(
    input: FindAllEvaluationInputDto
  ): Promise<FindAllEvaluationOutputDto>;
  delete(input: DeleteEvaluationInputDto): Promise<DeleteEvaluationOutputDto>;
  update(input: UpdateEvaluationInputDto): Promise<UpdateEvaluationOutputDto>;
}
