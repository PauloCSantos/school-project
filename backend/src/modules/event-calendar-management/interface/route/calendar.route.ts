import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import EventController from '../controller/calendar.controller';
import { validId } from '@/modules/@shared/utils/validations';

import {
  CreateEventInputDto,
  UpdateEventInputDto,
  FindEventInputDto,
  FindAllEventInputDto,
} from '../../application/dto/calendar-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

export default class EventRoute {
  constructor(
    private readonly eventController: EventController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/events',
      this.findAllEvents.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/event',
      this.createEvent.bind(this),
      this.authMiddleware
    );

    this.httpGateway.get(
      '/event/:id',
      this.findEvent.bind(this),
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/event/:id',
      this.updateEvent.bind(this),
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/event/:id',
      this.deleteEvent.bind(this),
      this.authMiddleware
    );
  }

  private async findAllEvents(
    req: HttpRequest<{}, {}, FindAllEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset estão incorretos' },
        };
      }
      const response = await this.eventController.findAll({ quantity, offset });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createEvent(
    req: HttpRequest<{}, {}, CreateEventInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de evento' },
        };
      }
      const response = await this.eventController.create(input);
      return { statusCode: 201, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findEvent(
    req: HttpRequest<FindEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.eventController.find({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateEvent(
    req: HttpRequest<FindEventInputDto, {}, UpdateEventInputDto, {}>
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
      const response = await this.eventController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteEvent(
    req: HttpRequest<FindEventInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.eventController.delete({ id });
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

  private validateCreate(input: CreateEventInputDto): boolean {
    const { creator, name, date, hour, day, type, place } = input;
    if (!creator || !name || !date || !hour || !day || !type || !place) {
      return false;
    }
    return true;
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
