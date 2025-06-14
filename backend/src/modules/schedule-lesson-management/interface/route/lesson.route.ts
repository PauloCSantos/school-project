import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { LessonController } from '../controller/lesson.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';
import {
  CreateLessonInputDto,
  FindAllLessonInputDto,
  FindLessonInputDto,
  UpdateLessonInputDto,
  DeleteLessonInputDto,
  AddStudentsInputDto,
  RemoveStudentsInputDto,
  AddDayInputDto,
  RemoveDayInputDto,
  AddTimeInputDto,
  RemoveTimeInputDto,
} from '../../application/dto/lesson-usecase.dto';

/**
 * Route handler for lesson management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export default class LessonRoute {
  constructor(
    private readonly lessonController: LessonController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/lessons',
      this.findAllLessons.bind(this),
      this.authMiddleware
    );
    this.httpGateway.get(
      '/lesson/:id',
      this.findLesson.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson',
      this.createLesson.bind(this),
      this.authMiddleware
    );
    this.httpGateway.patch(
      '/lesson/:id',
      this.updateLesson.bind(this),
      this.authMiddleware
    );
    this.httpGateway.delete(
      '/lesson/:id',
      this.deleteLesson.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/student/add',
      this.addStudents.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/student/remove',
      this.removeStudents.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/day/add',
      this.addDay.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/day/remove',
      this.removeDay.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/time/add',
      this.addTime.bind(this),
      this.authMiddleware
    );
    this.httpGateway.post(
      '/lesson/:id/time/remove',
      this.removeTime.bind(this),
      this.authMiddleware
    );
  }

  private async findAllLessons(
    req: HttpRequest<{}, {}, FindAllLessonInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const lessons = await this.lessonController.findAll({ quantity, offset });
      return { statusCode: 200, body: lessons };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findLesson(
    req: HttpRequest<FindLessonInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const lesson = await this.lessonController.find({ id });
      return { statusCode: 200, body: lesson };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createLesson(
    req: HttpRequest<{}, {}, CreateLessonInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de aula' },
        };
      }
      const lesson = await this.lessonController.create(input);
      return { statusCode: 201, body: lesson };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateLesson(
    req: HttpRequest<FindLessonInputDto, {}, UpdateLessonInputDto, {}>
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
      const response = await this.lessonController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteLesson(
    req: HttpRequest<DeleteLessonInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.lessonController.delete({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addStudents(
    req: HttpRequest<FindLessonInputDto, {}, AddStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateStudents(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para adicionar alunos inválidos' },
        };
      }
      const response = await this.lessonController.addStudents({
        ...input,
        id,
      });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeStudents(
    req: HttpRequest<FindLessonInputDto, {}, RemoveStudentsInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateStudents(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para remover alunos inválidos' },
        };
      }
      const response = await this.lessonController.removeStudents({
        ...input,
        id,
      });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addDay(
    req: HttpRequest<FindLessonInputDto, {}, AddDayInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateDay(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para adicionar dia inválidos' },
        };
      }
      const response = await this.lessonController.addDay({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeDay(
    req: HttpRequest<FindLessonInputDto, {}, RemoveDayInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateDay(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para remover dia inválidos' },
        };
      }
      const response = await this.lessonController.removeDay({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addTime(
    req: HttpRequest<FindLessonInputDto, {}, AddTimeInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateTime(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para adicionar tempo inválidos' },
        };
      }
      const response = await this.lessonController.addTime({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeTime(
    req: HttpRequest<FindLessonInputDto, {}, RemoveTimeInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id) || !this.validateTime(input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para remover tempo inválidos' },
        };
      }
      const response = await this.lessonController.removeTime({ ...input, id });
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

  private validateCreate(input: CreateLessonInputDto): boolean {
    if (
      !input.name ||
      typeof input.name !== 'string' ||
      !input.duration ||
      typeof input.duration !== 'number' ||
      !input.teacher ||
      typeof input.teacher !== 'string' ||
      !Array.isArray(input.studentsList) ||
      !input.subject ||
      typeof input.subject !== 'string' ||
      !Array.isArray(input.days) ||
      !Array.isArray(input.times) ||
      (input.semester !== 1 && input.semester !== 2)
    ) {
      return false;
    }
    return true;
  }

  private validateStudents(
    input: AddStudentsInputDto | RemoveStudentsInputDto
  ): boolean {
    if (!input.id) {
      return false;
    }

    if ('newStudentsList' in input) {
      return (
        Array.isArray(input.newStudentsList) && input.newStudentsList.length > 0
      );
    }

    if ('studentsListToRemove' in input) {
      return (
        Array.isArray(input.studentsListToRemove) &&
        input.studentsListToRemove.length > 0
      );
    }

    return false;
  }

  private validateDay(input: AddDayInputDto | RemoveDayInputDto): boolean {
    if (!input.id) {
      return false;
    }

    if ('newDaysList' in input) {
      return Array.isArray(input.newDaysList) && input.newDaysList.length > 0;
    }

    if ('daysListToRemove' in input) {
      return (
        Array.isArray(input.daysListToRemove) &&
        input.daysListToRemove.length > 0
      );
    }

    return false;
  }

  private validateTime(input: AddTimeInputDto | RemoveTimeInputDto): boolean {
    if (!input.id) {
      return false;
    }

    if ('newTimesList' in input) {
      return Array.isArray(input.newTimesList) && input.newTimesList.length > 0;
    }

    if ('timesListToRemove' in input) {
      return (
        Array.isArray(input.timesListToRemove) &&
        input.timesListToRemove.length > 0
      );
    }

    return false;
  }
}
