import {
  HttpServer,
  HttpResponseData,
} from '@/modules/@shared/infraestructure/http/http.interface';
import EvaluationController from '../controller/evaluation.controller';
import { validId } from '@/modules/@shared/utils/validations';
import AuthUserMiddleware, {
  AuthHttpRequest,
} from '@/modules/@shared/application/middleware/authUser.middleware';
import { AuthErrorHandlerMiddleware } from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  CreateEvaluationInputDto,
  UpdateEvaluationInputDto,
  FindAllEvaluationInputDto,
  FindEvaluationInputDto,
} from '../../application/dto/evaluation-usecase.dto';

export default class EvaluationRoute {
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const errorHandler = new AuthErrorHandlerMiddleware();

    this.httpGateway.get(
      '/evaluations',
      this.findAllEvaluations.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.post(
      '/evaluation',
      this.createEvaluation.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.get(
      '/evaluation/:id',
      this.findEvaluation.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/evaluation/:id',
      this.updateEvaluation.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/evaluation/:id',
      this.deleteEvaluation.bind(this),
      errorHandler,
      this.authMiddleware
    );
  }

  private async findAllEvaluations(
    req: AuthHttpRequest<{}, {}, FindAllEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset estão incorretos' },
        };
      }
      const response = await this.evaluationController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvaluation(
    req: AuthHttpRequest<{}, {}, CreateEvaluationInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de avaliação' },
        };
      }
      const response = await this.evaluationController.create(input);
      return { statusCode: 201, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvaluation(
    req: AuthHttpRequest<FindEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.evaluationController.find({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateEvaluation(
    req: AuthHttpRequest<
      FindEvaluationInputDto,
      {},
      UpdateEvaluationInputDto,
      {}
    >
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const response = await this.evaluationController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvaluation(
    req: AuthHttpRequest<FindEvaluationInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const message = await this.evaluationController.delete({ id });
      return { statusCode: 200, body: message };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateFindAll(quantity?: number, offset?: number): boolean {
    return (
      quantity !== undefined &&
      offset !== undefined &&
      !isNaN(quantity) &&
      !isNaN(offset)
    );
  }

  private validateCreate(input: CreateEvaluationInputDto): boolean {
    return (
      input &&
      typeof input.teacher === 'string' &&
      input.teacher.trim() !== '' &&
      typeof input.lesson === 'string' &&
      input.lesson.trim() !== ''
    );
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
