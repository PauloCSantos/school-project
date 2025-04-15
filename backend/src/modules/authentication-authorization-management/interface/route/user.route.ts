import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserController from '../controller/user.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  isNotEmpty,
  validEmail,
  validRole,
} from '@/modules/@shared/utils/validations';

/**
 * Route handler for authentication and user management endpoints.
 * Maps HTTP requests to controller methods and handles request validation.
 */
export default class AuthUserRoute {
  /**
   * Creates a new AuthUserRoute instance.
   * @param authUserController - Controller for handling authentication user operations
   * @param httpGateway - HTTP framework abstraction for route handling
   * @param authMiddleware - Middleware for authentication and authorization
   */
  constructor(
    private readonly authUserController: AuthUserController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  /**
   * Registers all routes with the HTTP gateway.
   */
  public routes(): void {
    this.httpGateway.get('/authUser/:email', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAuthUser(req, res));
    });
    this.httpGateway.patch('/authUser/:email', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateAuthUser(req, res));
    });
    this.httpGateway.delete('/authUser/:email', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteAuthUser(req, res));
    });
    this.httpGateway.post('/register', (req: any, res: any) => {
      this.createAuthUser(req, res);
    });
    this.httpGateway.post('/login', (req: any, res: any) => {
      this.loginAuthUser(req, res);
    });
  }

  /**
   * Handles user registration requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async createAuthUser(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return res
          .status(400)
          .json({ error: 'Todos os campos são obrigatórios' });
      }

      const response = await this.authUserController.create(input);
      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles user lookup requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async findAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      if (!this.validFind(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const response = await this.authUserController.find({ email });
      if (!response) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles user update requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async updateAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      const input = req.body;

      if (!this.validUpdate(email, input)) {
        return res
          .status(400)
          .json({ error: 'Email e/ou dados de atualização inválidos' });
      }

      input.email = email;
      const response = await this.authUserController.update(input);
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res, 404);
    }
  }

  /**
   * Handles user deletion requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async deleteAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      if (!this.validDelete(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const response = await this.authUserController.delete({ email });
      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles user login requests.
   * @param req - HTTP request object
   * @param res - HTTP response object
   */
  private async loginAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email, password, role } = req.body;
      if (!this.validLogin(email, password, role)) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }

      const response = await this.authUserController.login({
        email,
        password,
        role,
      });
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
   * Validates input for user creation.
   * @param input - The input data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validateCreate(input: any): boolean {
    const { email, password, role } = input;
    return email !== undefined && password !== undefined && role !== undefined;
  }

  /**
   * Validates email for user lookup.
   * @param email - The email to validate
   * @returns Boolean indicating if the email is valid
   */
  private validFind(email: any): boolean {
    return validEmail(email);
  }

  /**
   * Validates input for user update.
   * @param email - The email to validate
   * @param input - The update data to validate
   * @returns Boolean indicating if the input is valid
   */
  private validUpdate(email: any, input: any): boolean {
    if (!validEmail(email)) return false;

    // Verifica se pelo menos um campo foi fornecido para atualização
    return Object.values(input).some(value => value !== undefined);
  }

  /**
   * Validates email for user deletion.
   * @param email - The email to validate
   * @returns Boolean indicating if the email is valid
   */
  private validDelete(email: any): boolean {
    return validEmail(email);
  }

  /**
   * Validates credentials for user login.
   * @param email - The email to validate
   * @param password - The password to validate
   * @param role - The role to validate
   * @returns Boolean indicating if the credentials are valid
   */
  private validLogin(email: string, password: string, role: string): boolean {
    return validEmail(email) && isNotEmpty(password) && validRole(role);
  }
}
