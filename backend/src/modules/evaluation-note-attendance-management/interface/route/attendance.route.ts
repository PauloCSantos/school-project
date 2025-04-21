import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import AttendanceController from '../controller/attendance.controller';
import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for attendance management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class AttendanceRoute {
  /**
   * Creates a new AttendanceRoute instance.
   * @param attendanceController - Controller for handling attendance operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/attendances', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllAttendances(req, res)
      );
    });
    this.httpGateway.post('/attendance', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.createAttendance(req, res)
      );
    });
    this.httpGateway.get('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAttendance(req, res));
    });
    this.httpGateway.patch('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.updateAttendance(req, res)
      );
    });
    this.httpGateway.delete('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.deleteAttendance(req, res)
      );
    });
    this.httpGateway.post('/attendance/add/students', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addStudents(req, res));
    });
    this.httpGateway.post(
      '/attendance/remove/students',
      (req: any, res: any) => {
        this.authMiddleware.handle(req, res, () =>
          this.removeStudents(req, res)
        );
      }
    );
  }

  /**
   * Handles retrieving all attendances with pagination.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllAttendances(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.attendanceController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles attendance creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createAttendance(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const response = await this.attendanceController.create({
        ...input,
        date: new Date(input.date),
      });
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles retrieving a specific attendance record.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.attendanceController.find({ id });
      if (!response) {
        return res
          .status(404)
          .json({ error: 'Registro de presença não encontrado' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles attendance update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      if (input.date) {
        input.date = new Date(input.date);
      }

      const response = await this.attendanceController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles attendance deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.attendanceController.delete({ id });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles adding students to an attendance record.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async addStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input)) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const response = await this.attendanceController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles removing students from an attendance record.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async removeStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input)) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const response = await this.attendanceController.removeStudents(input);
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
   * Validates pagination parameters for findAll operations.
   * @param quantity - Number of items to return
   * @param offset - Pagination offset
   * @returns Boolean indicating if the parameters are valid
   */
  private validateFindAll(
    quantity: number | undefined,
    offset: number | undefined
  ): boolean {
    // Corrigido para validar corretamente os parâmetros
    if (
      quantity !== undefined &&
      typeof quantity === 'number' &&
      isNaN(quantity)
    ) {
      return false;
    }

    if (offset !== undefined && typeof offset === 'number' && isNaN(offset)) {
      return false;
    }

    return true;
  }

  /**
   * Validates input for attendance creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { date, day, hour, lesson, studentsPresent } = input;
    return (
      date !== undefined &&
      day !== undefined &&
      hour !== undefined &&
      lesson !== undefined &&
      studentsPresent !== undefined
    );
  }

  /**
   * Validates ID for attendance lookup.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for attendance update.
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
   * Validates ID for attendance deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for adding students to attendance.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validAdd(input: any): boolean {
    return validId(input.id) && input.newStudentsList !== undefined;
  }

  /**
   * Validates input for removing students from attendance.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validRemove(input: any): boolean {
    return validId(input.id) && input.studentsListToRemove !== undefined;
  }
}
