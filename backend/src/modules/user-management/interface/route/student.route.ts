import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserStudentController } from '../controller/student.controller';
import {
  CreateUserStudentInputDto,
  FindAllUserStudentInputDto,
  FindUserStudentInputDto,
  UpdateUserStudentInputDto,
  DeleteUserStudentInputDto,
} from '../../application/dto/student-usecase.dto';
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

export class UserStudentRoute {
  constructor(
    private readonly userStudentController: UserStudentController,
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
      'paymentYear',
    ];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get(
      '/users-student',
      this.findAllUserStudents.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
      ]
    );

    this.httpGateway.post('/user-student', this.createUserStudent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/user-student/:id', this.findUserStudent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/user-student', this.updateUserStudent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete(
      '/user-student/:id',
      this.deleteUserStudent.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
      ]
    );
  }

  private async findAllUserStudents(
    req: HttpRequest<{}, FindAllUserStudentInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.userStudentController.findAll({
        quantity,
        offset,
      });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserStudent(
    req: HttpRequest<FindUserStudentInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userStudentController.find({ id });
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

  private async createUserStudent(
    req: HttpRequest<{}, {}, CreateUserStudentInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.userStudentController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserStudent(
    req: HttpRequest<{}, {}, UpdateUserStudentInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.userStudentController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserStudent(
    req: HttpRequest<DeleteUserStudentInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userStudentController.delete({ id });
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
