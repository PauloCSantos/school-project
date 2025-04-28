import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import EventController from '../controller/calendar.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for event calendar management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export default class EventRoute {
  /**
   * Creates a new EventRoute instance.
   * @param eventController - Controller for handling event operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly eventController: EventController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/events', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAllEvents(req, res));
    });
    this.httpGateway.post('/event', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.createEvent(req, res));
    });
    this.httpGateway.get('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findEvent(req, res));
    });
    this.httpGateway.patch('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateEvent(req, res));
    });
    this.httpGateway.delete('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteEvent(req, res));
    });
  }

  /**
   * Handles retrieving multiple events with optional pagination.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllEvents(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.eventController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles event creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createEvent(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const response = await this.eventController.create({
        ...input,
        date: new Date(input.date),
      });
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles retrieving a single event by ID.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.eventController.find({ id });
      if (!response) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles event update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      const response = await this.eventController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles event deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.eventController.delete({ id });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Standardized error handling for route methods.
   * @param error - The error that occurred
   * @param res - HTTP response object
   * @param statusCode - Optional specific status code for errors
   */
  private handleError(error: unknown, res: any, statusCode = 400): void {
    if (error instanceof Error) {
      res.status(statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  /**
   * Validates input for findAll operation.
   * @param quantity - The number of events to retrieve
   * @param offset - The number of events to skip
   * @returns Boolean indicating if the parameters are valid
   */
  private validateFindAll(
    quantity: number | undefined,
    offset: number | undefined
  ): boolean {
    if (
      quantity === undefined ||
      (typeof quantity === 'number' &&
        isNaN(quantity) &&
        offset === undefined) ||
      (typeof offset === 'number' && isNaN(offset))
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Validates input for event creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { creator, name, date, hour, day, type, place } = input;

    return (
      creator !== undefined &&
      name !== undefined &&
      date !== undefined &&
      hour !== undefined &&
      day !== undefined &&
      type !== undefined &&
      place !== undefined
    );
  }

  /**
   * Validates ID for retrieving a single event.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for event update.
   * @param id - The ID to validate
   * @param input - The update data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validUpdate(id: any, input: any): boolean {
    if (!validId(id)) return false;

    // Verifica se pelo menos um campo foi fornecido para atualização
    return Object.values(input).some(value => value !== undefined);
  }

  /**
   * Validates ID for event deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }
}
