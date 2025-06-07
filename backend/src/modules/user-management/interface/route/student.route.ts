import { validId } from '@/modules/@shared/utils/validations';
import {
  HttpServer,
  HttpResponseData,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware, {
  AuthHttpRequest,
  AuthErrorHandlerMiddleware,
} from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserStudentController } from '../controller/student.controller';
import {
  CreateUserStudentInputDto,
  FindAllUserStudentInputDto,
  FindUserStudentInputDto,
  UpdateUserStudentInputDto,
  DeleteUserStudentInputDto,
} from '../../application/dto/student-usecase.dto';

export class UserStudentRoute {
  constructor(
    private readonly userStudentController: UserStudentController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const errorHandler = new AuthErrorHandlerMiddleware();

    this.httpGateway.get(
      '/users-student',
      this.findAllUserStudents.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.post(
      '/user-student',
      this.createUserStudent.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.get(
      '/user-student/:id',
      this.findUserStudent.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/user-student/:id',
      this.updateUserStudent.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/user-student/:id',
      this.deleteUserStudent.bind(this),
      errorHandler,
      this.authMiddleware
    );
  }

  private async findAllUserStudents(
    req: AuthHttpRequest<{}, {}, FindAllUserStudentInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const students = await this.userStudentController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: students };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserStudent(
    req: AuthHttpRequest<FindUserStudentInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const student = await this.userStudentController.find({ id });
      return { statusCode: 200, body: student };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createUserStudent(
    req: AuthHttpRequest<{}, {}, CreateUserStudentInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const newStudent = await this.userStudentController.create(input);
      return { statusCode: 201, body: newStudent };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserStudent(
    req: AuthHttpRequest<
      FindUserStudentInputDto,
      {},
      UpdateUserStudentInputDto,
      {}
    >
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const updatedStudent = await this.userStudentController.update({
        ...input,
        id,
      });
      return { statusCode: 200, body: updatedStudent };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserStudent(
    req: AuthHttpRequest<DeleteUserStudentInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const deleted = await this.userStudentController.delete({ id });
      return { statusCode: 200, body: deleted };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateFindAll(quantity?: number, offset?: number): boolean {
    if (quantity === undefined || offset === undefined) {
      return true;
    }
    return Number.isInteger(quantity) && Number.isInteger(offset);
  }

  private validateCreate(input: CreateUserStudentInputDto): boolean {
    if (
      !input.name ||
      typeof input.name.firstName !== 'string' ||
      typeof input.name.lastName !== 'string' ||
      !input.address ||
      typeof input.address.street !== 'string' ||
      typeof input.address.city !== 'string' ||
      typeof input.address.zip !== 'string' ||
      typeof input.address.number !== 'number' ||
      typeof input.address.avenue !== 'string' ||
      typeof input.address.state !== 'string' ||
      !input.email ||
      typeof input.email !== 'string' ||
      !input.birthday ||
      typeof input.birthday !== 'string'
    ) {
      return false;
    }
    return true;
  }

  private validFind(id: string): boolean {
    return validId(id);
  }

  private validUpdate(id: string, input: UpdateUserStudentInputDto): boolean {
    if (!validId(id)) return false;
    return Object.values(input).some(value => value !== undefined);
  }

  private validDelete(id: string): boolean {
    return validId(id);
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
