import {
  HttpServer,
  HttpResponseData,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { CurriculumController } from '../controller/curriculum.controller';
import AuthUserMiddleware, {
  AuthHttpRequest,
  AuthErrorHandlerMiddleware,
} from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';
import {
  CreateCurriculumInputDto,
  FindAllCurriculumInputDto,
  FindCurriculumInputDto,
  UpdateCurriculumInputDto,
  DeleteCurriculumInputDto,
  AddSubjectsInputDto,
  RemoveSubjectsInputDto,
} from '../../application/dto/curriculum-usecase.dto';

/**
 * Route handler for curriculum management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class CurriculumRoute {
  constructor(
    private readonly curriculumController: CurriculumController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const errorHandler = new AuthErrorHandlerMiddleware();

    this.httpGateway.get(
      '/curriculums',
      this.findAllCurriculums.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.get(
      '/curriculum/:id',
      this.findCurriculum.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.post(
      '/curriculum',
      this.createCurriculum.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.patch(
      '/curriculum/:id',
      this.updateCurriculum.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.delete(
      '/curriculum/:id',
      this.deleteCurriculum.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.post(
      '/curriculum/subject/add',
      this.addSubjects.bind(this),
      errorHandler,
      this.authMiddleware
    );
    this.httpGateway.post(
      '/curriculum/subject/remove',
      this.removeSubjects.bind(this),
      errorHandler,
      this.authMiddleware
    );
  }

  private async findAllCurriculums(
    req: AuthHttpRequest<{}, {}, FindAllCurriculumInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const curriculums = await this.curriculumController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: curriculums };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findCurriculum(
    req: AuthHttpRequest<FindCurriculumInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const curriculum = await this.curriculumController.find({ id });
      return { statusCode: 200, body: curriculum };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createCurriculum(
    req: AuthHttpRequest<{}, {}, CreateCurriculumInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de currículo' },
        };
      }
      const curriculum = await this.curriculumController.create(input);
      return { statusCode: 201, body: curriculum };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateCurriculum(
    req: AuthHttpRequest<
      FindCurriculumInputDto,
      {},
      UpdateCurriculumInputDto,
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
      const response = await this.curriculumController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteCurriculum(
    req: AuthHttpRequest<DeleteCurriculumInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.curriculumController.delete({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addSubjects(
    req: AuthHttpRequest<{}, {}, AddSubjectsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateSubjects(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para adicionar matérias inválidos' },
        };
      }
      const response = await this.curriculumController.addSubjects(input);
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeSubjects(
    req: AuthHttpRequest<{}, {}, RemoveSubjectsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateSubjects(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para remover matérias inválidos' },
        };
      }
      const response = await this.curriculumController.removeSubjects(input);
      return { statusCode: 200, body: response };
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

  private validateFindAll(quantity?: number, offset?: number): boolean {
    if (quantity === undefined || offset === undefined) {
      return true;
    }
    return Number.isInteger(quantity) && Number.isInteger(offset);
  }

  private validateCreate(input: CreateCurriculumInputDto): boolean {
    if (
      !input.name ||
      typeof input.name !== 'string' ||
      !Array.isArray(input.subjectsList) ||
      !input.yearsToComplete ||
      typeof input.yearsToComplete !== 'number' ||
      input.yearsToComplete <= 0
    ) {
      return false;
    }
    return true;
  }

  private validateSubjects(
    input: AddSubjectsInputDto | RemoveSubjectsInputDto
  ): boolean {
    if (!input.id || !validId(input.id)) {
      return false;
    }

    if ('newSubjectsList' in input) {
      return (
        Array.isArray(input.newSubjectsList) && input.newSubjectsList.length > 0
      );
    }

    if ('subjectsListToRemove' in input) {
      return (
        Array.isArray(input.subjectsListToRemove) &&
        input.subjectsListToRemove.length > 0
      );
    }

    return false;
  }
}
