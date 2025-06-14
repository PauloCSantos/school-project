import { validId } from '@/modules/@shared/utils/validations';
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

export class UserTeacherRoute {
  constructor(
    private readonly userTeacherController: UserTeacherController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/users-teacher',
      this.findAllUserTeachers.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/user-teacher',
      this.createUserTeacher.bind(this),
      this.authMiddleware
    );

    this.httpGateway.get(
      '/user-teacher/:id',
      this.findUserTeacher.bind(this),
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/user-teacher/:id',
      this.updateUserTeacher.bind(this),
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/user-teacher/:id',
      this.deleteUserTeacher.bind(this),
      this.authMiddleware
    );
  }

  private async findAllUserTeachers(
    req: HttpRequest<{}, {}, FindAllUserTeacherInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const teachers = await this.userTeacherController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: teachers };
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

  private async createUserTeacher(
    req: HttpRequest<{}, {}, CreateUserTeacherInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação do professor' },
        };
      }
      const newTeacher = await this.userTeacherController.create(input);
      return { statusCode: 201, body: newTeacher };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateCreate(input: CreateUserTeacherInputDto): boolean {
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
      typeof input.birthday !== 'string' ||
      !input.salary ||
      typeof input.salary.salary !== 'number' ||
      !input.graduation ||
      typeof input.graduation !== 'string' ||
      !input.academicDegrees ||
      typeof input.graduation !== 'string'
    ) {
      return false;
    }
    return true;
  }

  private async findUserTeacher(
    req: HttpRequest<FindUserTeacherInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const teacher = await this.userTeacherController.find({ id });
      return { statusCode: 200, body: teacher };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserTeacher(
    req: HttpRequest<FindUserTeacherInputDto, {}, UpdateUserTeacherInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const updatedTeacher = await this.userTeacherController.update({
        ...input,
        id,
      });
      return { statusCode: 200, body: updatedTeacher };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserTeacher(
    req: HttpRequest<DeleteUserTeacherInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const deleted = await this.userTeacherController.delete({ id });
      return { statusCode: 200, body: deleted };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validFind(id: string): boolean {
    return validId(id);
  }

  private validUpdate(id: string): boolean {
    return validId(id);
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
