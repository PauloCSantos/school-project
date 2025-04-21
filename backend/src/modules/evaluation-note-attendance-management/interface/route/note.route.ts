import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import NoteController from '../controller/note.controller';
import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for note management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class NoteRoute {
  /**
   * Creates a new NoteRoute instance.
   * @param noteController - Controller for handling note operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/notes', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAllNotes(req, res));
    });
    this.httpGateway.post('/note', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.createNote(req, res));
    });
    this.httpGateway.get('/note/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findNote(req, res));
    });
    this.httpGateway.patch('/note/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateNote(req, res));
    });
    this.httpGateway.delete('/note/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteNote(req, res));
    });
  }

  /**
   * Handles retrieving all notes with pagination.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllNotes(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.noteController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles note creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createNote(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const response = await this.noteController.create(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles retrieving a specific note.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.noteController.find({ id });
      if (!response) {
        return res.status(404).json({ error: 'Nota não encontrada' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles note update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      const response = await this.noteController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles note deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.noteController.delete({ id });
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
   * Validates input for note creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { evaluation, student, note } = input;
    return (
      evaluation !== undefined && student !== undefined && note !== undefined
    );
  }

  /**
   * Validates ID for note lookup.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for note update.
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
   * Validates ID for note deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }
}
