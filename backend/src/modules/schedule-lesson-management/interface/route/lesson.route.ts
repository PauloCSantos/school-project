import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { LessonController } from '../controller/lesson.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for lesson management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class LessonRoute {
  /**
   * Creates a new LessonRoute instance.
   * @param lessonController - Controller for handling lesson operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly lessonController: LessonController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/lessons', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAllLessons(req, res));
    });
    this.httpGateway.post('/lesson', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.createLesson(req, res));
    });
    this.httpGateway.get('/lesson/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findLesson(req, res));
    });
    this.httpGateway.patch('/lesson/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateLesson(req, res));
    });
    this.httpGateway.delete('/lesson/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteLesson(req, res));
    });
    this.httpGateway.post('/lesson/add/students', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addStudents(req, res));
    });
    this.httpGateway.post('/lesson/remove/students', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.removeStudents(req, res));
    });
    this.httpGateway.post('/lesson/add/day', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addDay(req, res));
    });
    this.httpGateway.post('/lesson/remove/day', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.removeDay(req, res));
    });
    this.httpGateway.post('/lesson/add/time', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addTime(req, res));
    });
    this.httpGateway.post('/lesson/remove/time', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.removeTime(req, res));
    });
  }

  /**
   * Handles requests to retrieve all lessons.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllLessons(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.lessonController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles lesson creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createLesson(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos sao obrigatorios' });
      }

      const response = await this.lessonController.create(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles lesson lookup requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id invalido' });
      }

      const response = await this.lessonController.find({ id });
      if (!response) {
        return res.status(404).json({ error: 'Aula não encontrada' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles lesson update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      const response = await this.lessonController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles lesson deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id invalido' });
      }

      const response = await this.lessonController.delete({ id });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to add students to a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async addStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newStudentsList')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to remove students from a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async removeStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'studentsListToRemove')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.removeStudents(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to add a day to a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async addDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newDaysList')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.addDay(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to remove a day from a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async removeDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'daysListToRemove')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.removeDay(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to add a time slot to a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async addTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newTimesList')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.addTime(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles requests to remove a time slot from a lesson.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async removeTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'timesListToRemove')) {
        return res.status(400).json({ error: 'Dados invalidos' });
      }

      const response = await this.lessonController.removeTime(input);
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
   * Validates input for finding all lessons.
   * @param quantity - The quantity of lessons to retrieve
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
   * Validates input for lesson creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const {
      name,
      duration,
      teacher,
      studentsList,
      subject,
      days,
      times,
      semester,
    } = input;

    return (
      name !== undefined &&
      duration !== undefined &&
      teacher !== undefined &&
      studentsList !== undefined &&
      subject !== undefined &&
      days !== undefined &&
      times !== undefined &&
      semester !== undefined
    );
  }

  /**
   * Validates ID for lesson lookup.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for lesson update.
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
   * Validates ID for lesson deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for adding items to a lesson.
   * @param input - The input data to validate
   * @param objectKey - The key for the list to be added
   * @returns Boolean indicating if the input is valid
   */
  private validAdd(input: any, objectKey: string): boolean {
    return validId(input.id) && input[objectKey] !== undefined;
  }

  /**
   * Validates input for removing items from a lesson.
   * @param input - The input data to validate
   * @param objectKey - The key for the list to be removed
   * @returns Boolean indicating if the input is valid
   */
  private validRemove(input: any, objectKey: string): boolean {
    return validId(input.id) && input[objectKey] !== undefined;
  }
}
