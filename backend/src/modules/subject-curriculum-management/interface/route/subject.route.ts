import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { SubjectController } from '../controller/subject.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';
import {
  CreateSubjectInputDto,
  FindAllSubjectInputDto,
  FindSubjectInputDto,
  UpdateSubjectInputDto,
  DeleteSubjectInputDto,
} from '../../application/dto/subject-usecase.dto';

/**
 * Route handler for subject management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class SubjectRoute {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/subjects',
      this.findAllSubjects.bind(this),
      this.authMiddleware
    );
    this.httpGateway.get(
      '/subject/:id',
      this.findSubject.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/subject',
      this.createSubject.bind(this),
      this.authMiddleware
    );
    this.httpGateway.patch(
      '/subject/:id',
      this.updateSubject.bind(this),
      this.authMiddleware
    );
    this.httpGateway.delete(
      '/subject/:id',
      this.deleteSubject.bind(this),
      this.authMiddleware
    );
  }

  private async findAllSubjects(
    req: HttpRequest<{}, {}, FindAllSubjectInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const subjects = await this.subjectController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: subjects };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findSubject(
    req: HttpRequest<FindSubjectInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const subject = await this.subjectController.find({ id });
      return { statusCode: 200, body: subject };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createSubject(
    req: HttpRequest<{}, {}, CreateSubjectInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de matéria' },
        };
      }
      const subject = await this.subjectController.create(input);
      return { statusCode: 201, body: subject };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateSubject(
    req: HttpRequest<FindSubjectInputDto, {}, UpdateSubjectInputDto, {}>
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
      const response = await this.subjectController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteSubject(
    req: HttpRequest<DeleteSubjectInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.subjectController.delete({ id });
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

  private validateCreate(input: CreateSubjectInputDto): boolean {
    if (
      !input.name ||
      typeof input.name !== 'string' ||
      !input.description ||
      typeof input.description !== 'string'
    ) {
      return false;
    }
    return true;
  }
}
