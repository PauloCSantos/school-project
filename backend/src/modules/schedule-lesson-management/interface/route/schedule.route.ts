import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { ScheduleController } from '../controller/schedule.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for schedule management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class ScheduleRoute {
  /**
   * Creates a new ScheduleRoute instance.
   * @param scheduleController - Controller for handling schedule operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly scheduleController: ScheduleController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/schedules', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllSchedules(req, res)
      );
    });
    this.httpGateway.post('/schedule', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.createSchedule(req, res));
    });
    this.httpGateway.get('/schedule/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findSchedule(req, res));
    });
    this.httpGateway.patch('/schedule/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateSchedule(req, res));
    });
    this.httpGateway.delete('/schedule/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteSchedule(req, res));
    });
    this.httpGateway.post('/schedule/add', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addLessons(req, res));
    });
    this.httpGateway.post('/schedule/remove', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.removeLessons(req, res));
    });
  }

  /**
   * Handles requests to retrieve all schedules.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllSchedules(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.scheduleController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles schedule creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createSchedule(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos sao obrigatorios' });
      }

      const response = await this.scheduleController.create(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles schedule lookup requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id invalido' });
      }

      const response = await this.scheduleController.find({ id });
      if (!response) {
        return res.status(404).json({ error: 'Cronograma não encontrado' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles schedule update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      const response = await this.scheduleController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles schedule deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id invalido' });
      }

      const response = await this.scheduleController.delete({ id });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to add lessons to a schedule.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async addLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input)) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.scheduleController.addLessons(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to remove lessons from a schedule.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async removeLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input)) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.scheduleController.removeLessons(input);
      res.status(201).json(response);
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
   * Validates input for finding all schedules.
   * @param quantity - The quantity of schedules to retrieve
   * @param offset - The offset for pagination
   * @returns Boolean indicating if the input is valid
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
   * Validates input for schedule creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { student, curriculum, lessonsList } = input;

    return (
      student !== undefined &&
      curriculum !== undefined &&
      lessonsList !== undefined
    );
  }

  /**
   * Validates ID for schedule lookup.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for schedule update.
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
   * Validates ID for schedule deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for adding lessons to a schedule.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validAdd(input: any): boolean {
    return validId(input.id) && input.newLessonsList !== undefined;
  }

  /**
   * Validates input for removing lessons from a schedule.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validRemove(input: any): boolean {
    return validId(input.id) && input.lessonsListToRemove !== undefined;
  }
}
