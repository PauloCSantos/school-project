import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EvaluationController from '../controller/evaluation.controller';
import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { validId } from '@/modules/@shared/utils/validations';

/**
 * Route handler for evaluation management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export class EvaluationRoute {
  /**
   * Creates a new EvaluationRoute instance.
   * @param evaluationController - Controller for handling evaluation operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/evaluations', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllEvaluations(req, res)
      );
    });
    this.httpGateway.post('/evaluation', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.createEvaluation(req, res)
      );
    });
    this.httpGateway.get('/evaluation/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findEvaluation(req, res));
    });
    this.httpGateway.patch('/evaluation/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.updateEvaluation(req, res)
      );
    });
    this.httpGateway.delete('/evaluation/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.deleteEvaluation(req, res)
      );
    });
  }

  /**
   * Handles retrieving all evaluations with pagination.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAllEvaluations(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      }

      const response = await this.evaluationController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles evaluation creation requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createEvaluation(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const response = await this.evaluationController.create(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles retrieving a specific evaluation.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.evaluationController.find({ id });
      if (!response) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles evaluation update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return res.status(400).json({ error: 'Id e/ou input incorretos' });
      }

      input.id = id;
      const response = await this.evaluationController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles evaluation deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return res.status(400).json({ error: 'Id inválido' });
      }

      const response = await this.evaluationController.delete({ id });
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
   * Validates input for evaluation creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { lesson, teacher, type, value } = input;
    return (
      lesson !== undefined &&
      teacher !== undefined &&
      type !== undefined &&
      value !== undefined
    );
  }

  /**
   * Validates ID for evaluation lookup.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validFind(id: any): boolean {
    return validId(id);
  }

  /**
   * Validates input for evaluation update.
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
   * Validates ID for evaluation deletion.
   * @param id - The ID to validate
   * @returns Boolean indicating if the ID is valid
   */
  private validDelete(id: any): boolean {
    return validId(id);
  }
}
