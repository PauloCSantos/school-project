import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { ScheduleController } from '../controller/schedule.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';
import {
  CreateScheduleInputDto,
  FindAllScheduleInputDto,
  UpdateScheduleInputDto,
  AddLessonsInputDto,
  RemoveLessonsInputDto,
  FindScheduleInputDto,
  DeleteScheduleInputDto,
} from '../../application/dto/schedule-usecase.dto';

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
    this.httpGateway.get(
      '/schedules',
      this.findAllSchedules.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/schedule',
      this.createSchedule.bind(this),
      this.authMiddleware
    );
    this.httpGateway.get(
      '/schedule/:id',
      this.findSchedule.bind(this),
      this.authMiddleware
    );
    this.httpGateway.patch(
      '/schedule/:id',
      this.updateSchedule.bind(this),
      this.authMiddleware
    );
    this.httpGateway.delete(
      '/schedule/:id',
      this.deleteSchedule.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/schedule/:id/lesson/add',
      this.addLessons.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/schedule/:id/lesson/remove',
      this.removeLessons.bind(this),
      this.authMiddleware
    );
  }

  private async findAllSchedules(
    req: HttpRequest<{}, {}, FindAllScheduleInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const schedules = await this.scheduleController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: schedules };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createSchedule(
    req: HttpRequest<{}, {}, CreateScheduleInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de evento' },
        };
      }
      const schedule = await this.scheduleController.create(input);
      return { statusCode: 201, body: schedule };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findSchedule(
    req: HttpRequest<FindScheduleInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.scheduleController.find({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateSchedule(
    req: HttpRequest<FindScheduleInputDto, {}, UpdateScheduleInputDto, {}>
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
      const response = await this.scheduleController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteSchedule(
    req: HttpRequest<DeleteScheduleInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.scheduleController.delete({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addLessons(
    req: HttpRequest<FindScheduleInputDto, {}, AddLessonsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateAdd(input)) {
        return { statusCode: 400, body: { error: 'Dados inválidos' } };
      }
      const response = await this.scheduleController.addLessons({
        ...input,
        id,
      });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeLessons(
    req: HttpRequest<FindScheduleInputDto, {}, RemoveLessonsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateRemove(input)) {
        return { statusCode: 400, body: { error: 'Dados inválidos' } };
      }
      const response = await this.scheduleController.removeLessons({
        ...input,
        id,
      });
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

  private validateCreate(input: CreateScheduleInputDto): boolean {
    const { student, curriculum, lessonsList } = input;
    return Boolean(student && curriculum && lessonsList);
  }

  private validateAdd(input: AddLessonsInputDto): boolean {
    return (
      Array.isArray(input.newLessonsList) && input.newLessonsList.length > 0
    );
  }

  private validateRemove(input: RemoveLessonsInputDto): boolean {
    return (
      Array.isArray(input.lessonsListToRemove) &&
      input.lessonsListToRemove.length > 0
    );
  }
}
