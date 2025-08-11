import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { ScheduleController } from '../controller/schedule.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  CreateScheduleInputDto,
  FindAllScheduleInputDto,
  UpdateScheduleInputDto,
  AddLessonsInputDto,
  RemoveLessonsInputDto,
  FindScheduleInputDto,
  DeleteScheduleInputDto,
} from '../../application/dto/schedule-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  StatusCodeEnum,
  StatusMessageEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Route handler for schedule management endpoint.
 */
export default class ScheduleRoute {
  constructor(
    private readonly scheduleController: ScheduleController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS_ADD = ['id', 'newLessonsList'];
    const REQUIRED_FIELDS_REMOVE = ['id', 'lessonsListToRemove'];
    const REQUIRED_FIELDS = ['student', 'curriculum', 'lessonsList'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/schedules', this.findAllSchedules.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);
    this.httpGateway.post('/schedule', this.createSchedule.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);
    this.httpGateway.get('/schedule/:id', this.findSchedule.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);
    this.httpGateway.patch('/schedule', this.updateSchedule.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);
    this.httpGateway.delete('/schedule/:id', this.deleteSchedule.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);
    this.httpGateway.post('/schedule/lesson/add', this.addLessons.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.ADD, REQUIRED_FIELDS_ADD),
    ]);
    this.httpGateway.post(
      '/schedule/lesson/remove',
      this.removeLessons.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(
          FunctionCalledEnum.REMOVE,
          REQUIRED_FIELDS_REMOVE
        ),
      ]
    );
  }

  private async findAllSchedules(
    req: HttpRequest<{}, FindAllScheduleInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const schedules = await this.scheduleController.findAll(
        {
          quantity,
          offset,
        },
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: schedules };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createSchedule(
    req: HttpRequest<{}, {}, CreateScheduleInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const schedule = await this.scheduleController.create(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.CREATED, body: schedule };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findSchedule(
    req: HttpRequest<FindScheduleInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.scheduleController.find(
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

  private async updateSchedule(
    req: HttpRequest<{}, {}, UpdateScheduleInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.scheduleController.update(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteSchedule(
    req: HttpRequest<DeleteScheduleInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.scheduleController.delete(
        { id },
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addLessons(
    req: HttpRequest<{}, {}, AddLessonsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.scheduleController.addLessons(
        input,
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeLessons(
    req: HttpRequest<{}, {}, RemoveLessonsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.scheduleController.removeLessons(
        input,
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
