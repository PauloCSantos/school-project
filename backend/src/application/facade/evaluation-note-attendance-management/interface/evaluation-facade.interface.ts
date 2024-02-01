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
