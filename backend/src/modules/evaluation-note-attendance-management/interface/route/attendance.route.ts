import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AttendanceController from '../controller/attendance.controller';
import { validId } from '@/modules/@shared/utils/validations';

import {
  CreateAttendanceInputDto,
  UpdateAttendanceInputDto,
  FindAttendanceInputDto,
  AddStudentsInputDto,
  RemoveStudentsInputDto,
} from '../../application/dto/attendance-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

export default class AttendanceRoute {
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/attendances',
      this.findAllAttendances.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/attendance',
      this.createAttendance.bind(this),
      this.authMiddleware
    );

    this.httpGateway.get(
      '/attendance/:id',
      this.findAttendance.bind(this),
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/attendance/:id',
      this.updateAttendance.bind(this),
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/attendance/:id',
      this.deleteAttendance.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/attendance/add/students',
      this.addStudents.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/attendance/remove/students',
      this.removeStudents.bind(this),
      this.authMiddleware
    );
  }

  private async findAllAttendances(
    req: HttpRequest<{}, {}, { quantity?: number; offset?: number }, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset estão incorretos' },
        };
      }
      const response = await this.attendanceController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createAttendance(
    req: HttpRequest<{}, {}, CreateAttendanceInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Todos os campos são obrigatórios' },
        };
      }
      const response = await this.attendanceController.create(input);
      return { statusCode: 201, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findAttendance(
    req: HttpRequest<FindAttendanceInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.attendanceController.find({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateAttendance(
    req: HttpRequest<FindAttendanceInputDto, {}, UpdateAttendanceInputDto, {}>
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
      const response = await this.attendanceController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteAttendance(
    req: HttpRequest<FindAttendanceInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const message = await this.attendanceController.delete({ id });
      return { statusCode: 200, body: message };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addStudents(
    req: HttpRequest<{}, {}, AddStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateStudents(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos' },
        };
      }
      const response = await this.attendanceController.addStudents(input);
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeStudents(
    req: HttpRequest<{}, {}, RemoveStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateStudents(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos' },
        };
      }
      const response = await this.attendanceController.removeStudents(input);
      return { statusCode: 200, body: response };
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

  private validateCreate(input: CreateAttendanceInputDto): boolean {
    return (
      input.date !== undefined &&
      input.lesson !== undefined &&
      Array.isArray(input.studentsPresent)
    );
  }

  private validateStudents(
    input: AddStudentsInputDto | RemoveStudentsInputDto
  ): boolean {
    if (!input.id) {
      return false;
    }

    if ('newStudentsList' in input) {
      return Array.isArray(input.newStudentsList);
    }

    if ('studentsListToRemove' in input) {
      return Array.isArray(input.studentsListToRemove);
    }

    return false;
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
