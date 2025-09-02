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
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import { FunctionCalledEnum, HttpStatus } from '@/modules/@shared/enums/enums';
import { mapErrorToHttp } from '@/modules/@shared/infraestructure/http/error.mapper';
import { EventNotFoundError } from '../../application/errors/event-not-found.error';

export default class EventRoute {
  constructor(
    private readonly eventController: EventController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = ['creator', 'name', 'date', 'hour', 'day', 'type', 'place'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/events', this.findAllEvents.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/event', this.createEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/event/:id', this.findEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/event', this.updateEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete('/event/:id', this.deleteEvent.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);
  }

  private async findAllEvents(
    req: HttpRequest<{}, FindAllEventInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.eventController.findAll(
        { quantity, offset },
        req.tokenData!
      );
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvent(
    req: HttpRequest<{}, {}, CreateEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.eventController.create(input, req.tokenData!);
      return { statusCode: HttpStatus.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvent(
    req: HttpRequest<FindEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.eventController.find({ id }, req.tokenData!);
      if (!response) {
        throw new EventNotFoundError(id);
      }
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateEvent(
    req: HttpRequest<{}, {}, UpdateEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.eventController.update(input, req.tokenData!);
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvent(
    req: HttpRequest<DeleteEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.eventController.delete({ id }, req.tokenData!);
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): HttpResponseData {
    return mapErrorToHttp(error);
  }
}
