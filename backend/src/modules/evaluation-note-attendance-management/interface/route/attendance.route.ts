import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AttendanceController from '../controller/attendance.controller';
import {
  CreateAttendanceInputDto,
  UpdateAttendanceInputDto,
  FindAttendanceInputDto,
  AddStudentsInputDto,
  RemoveStudentsInputDto,
  DeleteAttendanceInputDto,
} from '../../application/dto/attendance-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

export default class AttendanceRoute {
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS_ADD = ['id', 'newStudentsList'];
    const REQUIRED_FIELDS_REMOVE = ['id', 'studentsListToRemove'];
    const REQUIRED_FIELDS = [
      'date',
      'lesson',
      'studentsPresent',
      'hour',
      'day',
    ];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/attendances', this.findAllAttendances.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/attendance', this.createAttendance.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/attendance/:id', this.findAttendance.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/attendance', this.updateAttendance.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete(
      '/attendance/:id',
      this.deleteAttendance.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
      ]
    );

    this.httpGateway.post(
      '/attendance/add/students',
      this.addStudents.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.ADD, REQUIRED_FIELDS_ADD),
      ]
    );

    this.httpGateway.post(
      '/attendance/remove/students',
      this.removeStudents.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalled.REMOVE, REQUIRED_FIELDS_REMOVE),
      ]
    );
  }

  private async findAllAttendances(
    req: HttpRequest<{}, {}, { quantity?: number; offset?: number }, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.attendanceController.findAll({
        quantity,
        offset,
      });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createAttendance(
    req: HttpRequest<{}, {}, CreateAttendanceInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.attendanceController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findAttendance(
    req: HttpRequest<FindAttendanceInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.attendanceController.find({ id });
      if (!response) {
        return {
          statusCode: StatusCodeEnum.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateAttendance(
    req: HttpRequest<{}, {}, UpdateAttendanceInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.attendanceController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteAttendance(
    req: HttpRequest<DeleteAttendanceInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.attendanceController.delete({ id });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addStudents(
    req: HttpRequest<{}, {}, AddStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.attendanceController.addStudents(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeStudents(
    req: HttpRequest<{}, {}, RemoveStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.attendanceController.removeStudents(input);
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
