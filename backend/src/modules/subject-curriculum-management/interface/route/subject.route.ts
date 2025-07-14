import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { SubjectController } from '../controller/subject.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  CreateSubjectInputDto,
  FindAllSubjectInputDto,
  FindSubjectInputDto,
  UpdateSubjectInputDto,
  DeleteSubjectInputDto,
} from '../../application/dto/subject-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  StatusCodeEnum,
  StatusMessageEnum,
} from '@/modules/@shared/type/sharedTypes';

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
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = ['name', 'description'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/subjects', this.findAllSubjects.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);
    this.httpGateway.get('/subject/:id', this.findSubject.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);
    this.httpGateway.post('/subject', this.createSubject.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);
    this.httpGateway.patch('/subject', this.updateSubject.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELD),
    ]);
    this.httpGateway.delete('/subject/:id', this.deleteSubject.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);
  }

  private async findAllSubjects(
    req: HttpRequest<{}, FindAllSubjectInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.subjectController.findAll(
        {
          quantity,
          offset,
        },
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findSubject(
    req: HttpRequest<FindSubjectInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.subjectController.find(
        { id },
        req.tokenData!
      );
      if (!response) {
        return {
          statusCode: StatusCodeEnum.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createSubject(
    req: HttpRequest<{}, {}, CreateSubjectInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.subjectController.create(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateSubject(
    req: HttpRequest<{}, {}, UpdateSubjectInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.subjectController.update(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteSubject(
    req: HttpRequest<DeleteSubjectInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.subjectController.delete(
        { id },
        req.tokenData!
      );
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
