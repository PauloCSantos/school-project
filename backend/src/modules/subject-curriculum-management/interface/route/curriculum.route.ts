import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { CurriculumController } from '../controller/curriculum.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  CreateCurriculumInputDto,
  FindAllCurriculumInputDto,
  FindCurriculumInputDto,
  UpdateCurriculumInputDto,
  DeleteCurriculumInputDto,
  AddSubjectsInputDto,
  RemoveSubjectsInputDto,
} from '../../application/dto/curriculum-usecase.dto';
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

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
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS_ADD = ['id', 'newSubjectsList'];
    const REQUIRED_FIELDS_REMOVE = ['id', 'subjectsListToRemove'];
    const REQUIRED_FIELDS = ['name', 'subjectsList', 'yearsToComplete'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/curriculums', this.findAllCurriculums.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);
    this.httpGateway.get('/curriculum/:id', this.findCurriculum.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);
    this.httpGateway.post('/curriculum', this.createCurriculum.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);
    this.httpGateway.patch('/curriculum', this.updateCurriculum.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELD),
    ]);
    this.httpGateway.delete(
      '/curriculum/:id',
      this.deleteCurriculum.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
      ]
    );
    this.httpGateway.post(
      '/curriculum/subject/add',
      this.addSubjects.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.ADD, REQUIRED_FIELDS_ADD),
      ]
    );
    this.httpGateway.post(
      '/curriculum/subject/remove',
      this.removeSubjects.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.REMOVE, REQUIRED_FIELDS_REMOVE),
      ]
    );
  }

  private async findAllCurriculums(
    req: HttpRequest<{}, FindAllCurriculumInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.curriculumController.findAll({
        quantity,
        offset,
      });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findCurriculum(
    req: HttpRequest<FindCurriculumInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.curriculumController.find({ id });
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

  private async createCurriculum(
    req: HttpRequest<{}, {}, CreateCurriculumInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.curriculumController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateCurriculum(
    req: HttpRequest<{}, {}, UpdateCurriculumInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.curriculumController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteCurriculum(
    req: HttpRequest<DeleteCurriculumInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.curriculumController.delete({ id });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addSubjects(
    req: HttpRequest<{}, {}, AddSubjectsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.curriculumController.addSubjects(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeSubjects(
    req: HttpRequest<{}, {}, RemoveSubjectsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.curriculumController.removeSubjects(input);
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
