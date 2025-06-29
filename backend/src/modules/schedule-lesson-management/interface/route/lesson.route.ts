import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import { LessonController } from '../controller/lesson.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
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
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

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
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = [
      'name',
      'duration',
      'teacher',
      'studentsList',
      'subject',
      'days',
      'times',
      'semester',
    ];
    const REQUIRED_FIELD = ['id'];
    const REQUIRED_FIELDS_ADD_STUDENT = ['id', 'newStudentsList'];
    const REQUIRED_FIELDS_REMOVE_STUDENT = ['id', 'studentsListToRemove'];
    const REQUIRED_FIELDS_ADD_DAY = ['id', 'newDaysList'];
    const REQUIRED_FIELDS_REMOVE_DAY = ['id', 'daysListToRemove'];
    const REQUIRED_FIELDS_ADD_TIME = ['id', 'newTimesList'];
    const REQUIRED_FIELDS_REMOVE_TIME = ['id', 'timesListToRemove'];

    this.httpGateway.get('/lessons', this.findAllLessons.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);
    this.httpGateway.get('/lesson/:id', this.findLesson.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);
    this.httpGateway.post('/lesson', this.createLesson.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);
    this.httpGateway.patch('/lesson', this.updateLesson.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELD),
    ]);
    this.httpGateway.delete('/lesson/:id', this.deleteLesson.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
    ]);
    this.httpGateway.post('/lesson/student/add', this.addStudents.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.ADD, REQUIRED_FIELDS_ADD_STUDENT),
    ]);
    this.httpGateway.post(
      '/lesson/student/remove',
      this.removeStudents.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(
          FunctionCalled.REMOVE,
          REQUIRED_FIELDS_REMOVE_STUDENT
        ),
      ]
    );
    this.httpGateway.post('/lesson/day/add', this.addDay.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.ADD, REQUIRED_FIELDS_ADD_DAY),
    ]);
    this.httpGateway.post('/lesson/day/remove', this.removeDay.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(
        FunctionCalled.REMOVE,
        REQUIRED_FIELDS_REMOVE_DAY
      ),
    ]);
    this.httpGateway.post('/lesson/time/add', this.addTime.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.ADD, REQUIRED_FIELDS_ADD_TIME),
    ]);
    this.httpGateway.post('/lesson/time/remove', this.removeTime.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(
        FunctionCalled.REMOVE,
        REQUIRED_FIELDS_REMOVE_TIME
      ),
    ]);
  }

  private async findAllLessons(
    req: HttpRequest<{}, FindAllLessonInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const lessons = await this.lessonController.findAll({ quantity, offset });
      return { statusCode: StatusCodeEnum.OK, body: lessons };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findLesson(
    req: HttpRequest<FindLessonInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const lesson = await this.lessonController.find({ id });
      if (!lesson) {
        return {
          statusCode: StatusCodeEnum.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: StatusCodeEnum.OK, body: lesson };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createLesson(
    req: HttpRequest<{}, {}, CreateLessonInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const lesson = await this.lessonController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: lesson };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateLesson(
    req: HttpRequest<{}, {}, UpdateLessonInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.lessonController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteLesson(
    req: HttpRequest<DeleteLessonInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.lessonController.delete({ id });
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
      const response = await this.lessonController.addStudents(input);
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
      const response = await this.lessonController.removeStudents(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addDay(
    req: HttpRequest<{}, {}, AddDayInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.lessonController.addDay(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeDay(
    req: HttpRequest<{}, {}, RemoveDayInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.lessonController.removeDay(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async addTime(
    req: HttpRequest<{}, {}, AddTimeInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.lessonController.addTime(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async removeTime(
    req: HttpRequest<{}, {}, RemoveTimeInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.lessonController.removeTime(input);
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
