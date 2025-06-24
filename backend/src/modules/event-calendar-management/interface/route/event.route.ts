import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import EventController from '../controller/event.controller';

import {
  CreateEventInputDto,
  UpdateEventInputDto,
  FindEventInputDto,
  FindAllEventInputDto,
  DeleteEventInputDto,
} from '../../application/dto/event-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  FunctionCalled,
  createRequestMiddleware,
} from '@/modules/@shared/application/middleware/request.middleware';
import { StatusCodeEnum, StatusMessageEnum } from '@/modules/@shared/type/enum';

export default class EventRoute {
  constructor(
    private readonly eventController: EventController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = [
      'creator',
      'name',
      'date',
      'hour',
      'day',
      'type',
      'place',
    ];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/events', this.findAllEvents.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/event', this.createEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/event/:id', this.findEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/event', this.updateEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete('/event/:id', this.deleteEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalled.DELETE, REQUIRED_FIELD),
    ]);
  }

  private async findAllEvents(
    req: HttpRequest<{}, {}, FindAllEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.eventController.findAll({ quantity, offset });
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvent(
    req: HttpRequest<{}, {}, CreateEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.eventController.create(input);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvent(
    req: HttpRequest<FindEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.eventController.find({ id });
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

  private async updateEvent(
    req: HttpRequest<{}, {}, UpdateEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.eventController.update(input);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvent(
    req: HttpRequest<DeleteEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.eventController.delete({ id });
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
