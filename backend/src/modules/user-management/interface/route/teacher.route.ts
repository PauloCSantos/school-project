import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserTeacherController } from '../controller/teacher.controller';
import {
  CreateUserTeacherInputDto,
  FindAllUserTeacherInputDto,
  FindUserTeacherInputDto,
  UpdateUserTeacherInputDto,
  DeleteUserTeacherInputDto,
} from '../../application/dto/teacher-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  StatusCodeEnum,
  StatusMessageEnum,
} from '@/modules/@shared/enums/enums';

export class UserTeacherRoute {
  constructor(
    private readonly userTeacherController: UserTeacherController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = [
      'name',
      'address',
      'email',
      'birthday',
      'salary',
      'graduation',
      'academicDegrees',
    ];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get(
      '/users-teacher',
      this.findAllUserTeachers.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(
          FunctionCalledEnum.FIND_ALL,
          REQUIRED_FIELDS_ALL
        ),
      ]
    );

    this.httpGateway.post('/user-teacher', this.createUserTeacher.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/user-teacher/:id', this.findUserTeacher.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/user-teacher', this.updateUserTeacher.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete(
      '/user-teacher/:id',
      this.deleteUserTeacher.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
      ]
    );
  }

  private async findAllUserTeachers(
    req: HttpRequest<{}, FindAllUserTeacherInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.userTeacherController.findAll(
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

  private async createUserTeacher(
    req: HttpRequest<{}, {}, CreateUserTeacherInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const resolve = await this.userTeacherController.create(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.CREATED, body: resolve };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserTeacher(
    req: HttpRequest<FindUserTeacherInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userTeacherController.find(
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

  private async updateUserTeacher(
    req: HttpRequest<{}, {}, UpdateUserTeacherInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const resolve = await this.userTeacherController.update(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: resolve };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserTeacher(
    req: HttpRequest<DeleteUserTeacherInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userTeacherController.delete(
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
