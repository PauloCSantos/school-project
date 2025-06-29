import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import EvaluationController from '../controller/evaluation.controller';

import {
  CreateEvaluationInputDto,
  UpdateEvaluationInputDto,
  FindAllEvaluationInputDto,
  FindEvaluationInputDto,
  DeleteEvaluationInputDto,
} from '../../application/dto/evaluation-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

export default class EvaluationRoute {
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = ['teacher', 'lesson', 'type', 'value'];
    const REQUIRED_FIELD = ['id'];
    this.httpGateway.get('/evaluations', this.findAllEvaluations.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/evaluation', this.createEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/evaluation/:id', this.findEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/evaluation', this.updateEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete(
      '/evaluation/:id',
      this.deleteEvaluation.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
      ]
    );
  }

  private async findAllEvaluations(
    req: HttpRequest<{}, FindAllEvaluationInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.evaluationController.findAll({
        quantity,
        offset,
      });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvaluation(
    req: HttpRequest<{}, {}, CreateEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.evaluationController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvaluation(
    req: HttpRequest<FindEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.evaluationController.find({ id });
      if (!response) {
        return {
          statusCode: StatusCodeEnum.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateEvaluation(
    req: HttpRequest<{}, {}, UpdateEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.evaluationController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvaluation(
    req: HttpRequest<DeleteEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.evaluationController.delete({ id });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
