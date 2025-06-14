import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserController from '../controller/user.controller';

import {
  isNotEmpty,
  validEmail,
  validRole,
} from '@/modules/@shared/utils/validations';

import {
  CreateAuthUserInputDto,
  FindAuthUserInputDto,
  LoginAuthUserInputDto,
  UpdateAuthUserInputDto,
} from '../../application/dto/user-usecase.dto';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

export default class AuthUserRoute {
  constructor(
    private readonly authUserController: AuthUserController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    // instanciamos um único handler de erro para usar em todas as rotas protegidas

    // Rotas protegidas: primeiro o errorHandler, depois o authMiddleware
    this.httpGateway.get(
      '/authUser/:email',
      this.findAuthUser.bind(this),
      this.authMiddleware
    );
    this.httpGateway.patch(
      '/authUser/:email',
      this.updateAuthUser.bind(this),
      this.authMiddleware
    );
    this.httpGateway.delete(
      '/authUser/:email',
      this.deleteAuthUser.bind(this),
      this.authMiddleware
    );

    // Rotas públicas
    this.httpGateway.post('/register', this.createAuthUser.bind(this));
    this.httpGateway.post('/login', this.loginAuthUser.bind(this));
  }

  private async createAuthUser(
    req: HttpRequest<{}, {}, CreateAuthUserInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Todos os campos são obrigatórios' },
        };
      }

      const response = await this.authUserController.create(input);
      return {
        statusCode: 201,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findAuthUser(
    req: HttpRequest<FindAuthUserInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { email } = req.params;
      if (!validEmail(email)) {
        return {
          statusCode: 400,
          body: { error: 'Email inválido' },
        };
      }

      const response = await this.authUserController.find({ email });
      if (!response) {
        return {
          statusCode: 404,
          body: { error: 'Usuário não encontrado' },
        };
      }

      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateAuthUser(
    req: HttpRequest<FindAuthUserInputDto, {}, UpdateAuthUserInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { email } = req.params;
      const input = req.body;
      if (
        !validEmail(email) ||
        !Object.values(input).some(v => v !== undefined)
      ) {
        return {
          statusCode: 400,
          body: { error: 'Email e/ou dados de atualização inválidos' },
        };
      }

      // Exemplo de uso de req.tokenData:
      // if (req.tokenData.masterId !== email) { ... }

      const updateData = { ...input, email };
      const response = await this.authUserController.update(updateData);
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async deleteAuthUser(
    req: HttpRequest<FindAuthUserInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { email } = req.params;
      if (!validEmail(email)) {
        return {
          statusCode: 400,
          body: { error: 'Email inválido' },
        };
      }

      const response = await this.authUserController.delete({ email });
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async loginAuthUser(
    req: HttpRequest<{}, {}, LoginAuthUserInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { email, password, role } = req.body;
      if (!validEmail(email) || !isNotEmpty(password) || !validRole(role)) {
        return {
          statusCode: 400,
          body: { error: 'Credenciais inválidas' },
        };
      }

      const response = await this.authUserController.login({
        email,
        password,
        role,
      });
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return {
        statusCode,
        body: { error: error.message },
      };
    }
    return {
      statusCode: 500,
      body: { error: 'Erro interno do servidor' },
    };
  }

  // Métodos de validação simplificados inline...
  private validateCreate(input: CreateAuthUserInputDto): boolean {
    return (
      input.email !== undefined &&
      input.password !== undefined &&
      input.role !== undefined
    );
  }
}
