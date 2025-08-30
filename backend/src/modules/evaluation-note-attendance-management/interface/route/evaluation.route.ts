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
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  HttpStatus,
  StatusMessageEnum,
} from '@/modules/@shared/enums/enums';
import { mapErrorToHttp } from '@/modules/@shared/infraestructure/http/error.mapper';

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
      createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/evaluation', this.createEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/evaluation/:id', this.findEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/evaluation', this.updateEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete('/evaluation/:id', this.deleteEvaluation.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);
  }

  private async findAllEvaluations(
    req: HttpRequest<{}, FindAllEvaluationInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.evaluationController.findAll(
        {
          quantity,
          offset,
        },
        req.tokenData!
      );
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvaluation(
    req: HttpRequest<{}, {}, CreateEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.evaluationController.create(input, req.tokenData!);
      return { statusCode: HttpStatus.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvaluation(
    req: HttpRequest<FindEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.evaluationController.find({ id }, req.tokenData!);
      if (!response) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateEvaluation(
    req: HttpRequest<{}, {}, UpdateEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.evaluationController.update(input, req.tokenData!);
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvaluation(
    req: HttpRequest<DeleteEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.evaluationController.delete({ id }, req.tokenData!);
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): HttpResponseData {
    return mapErrorToHttp(error);
  }
}
