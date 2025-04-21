import {
  IFindEvaluationInput,
  IFindEvaluationOutput,
  IFindAllEvaluationInput,
  IFindAllEvaluationItemOutput,
  ICreateEvaluationInput,
  ICreateEvaluationOutput,
  IUpdateEvaluationInput,
  IUpdateEvaluationOutput,
  IDeleteEvaluationInput,
  IDeleteEvaluationOutput,
} from './base-evaluation.dto';

export type FindEvaluationInputDto = IFindEvaluationInput;
export type FindEvaluationOutputDto = IFindEvaluationOutput;

export type FindAllEvaluationInputDto = IFindAllEvaluationInput;
export type FindAllEvaluationOutputDto = Array<IFindAllEvaluationItemOutput>;

export type CreateEvaluationInputDto = ICreateEvaluationInput;
export type CreateEvaluationOutputDto = ICreateEvaluationOutput;

export type UpdateEvaluationInputDto = IUpdateEvaluationInput;
export type UpdateEvaluationOutputDto = IUpdateEvaluationOutput;

export type DeleteEvaluationInputDto = IDeleteEvaluationInput;
export type DeleteEvaluationOutputDto = IDeleteEvaluationOutput;
