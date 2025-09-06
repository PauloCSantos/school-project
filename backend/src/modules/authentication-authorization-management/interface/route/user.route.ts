import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
  HttpMiddleware,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserController from '../controller/user.controller';
import {
  CreateAuthUserInputDto,
  FindAuthUserInputDto,
  LoginAuthUserInputDto,
  UpdateAuthUserInputDto,
} from '../../application/dto/user-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import { FunctionCalledEnum, HttpStatus } from '@/modules/@shared/enums/enums';
import { mapErrorToHttp } from '@/modules/@shared/infraestructure/http/error.mapper';
import { AuthUserNotFoundError } from '../../application/errors/auth-user-not-found.error';

export default class AuthUserRoute {
  constructor(
    private readonly authUserController: AuthUserController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: HttpMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS = ['email', 'password', 'role'];
    const REQUIRED_FIELD = ['email'];

    this.httpGateway.get('/authUser/:email', this.findAuthUser.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/authUser', this.updateAuthUser.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete('/authUser/:email', this.deleteAuthUser.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);

    this.httpGateway.post('/registerTenant', this.createAuthUser.bind(this), [
      createRequestMiddleware(FunctionCalledEnum.CREATE, [...REQUIRED_FIELDS, 'cnpj']),
    ]);

    this.httpGateway.post('/register', this.createAuthUser.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.post('/login', this.loginAuthUser.bind(this), [
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.post('/checkRegistration', this.checkRegistration.bind(this), [
      this.authMiddleware,
    ]);
  }

  private async createAuthUser(
    req: HttpRequest<{}, {}, CreateAuthUserInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.authUserController.create(input, req.tokenData!);
      return {
        statusCode: HttpStatus.CREATED,
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
      const response = await this.authUserController.find({ email }, req.tokenData!);
      if (!response) {
        throw new AuthUserNotFoundError(email);
      }
      return {
        statusCode: HttpStatus.OK,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateAuthUser(
    req: HttpRequest<{}, {}, UpdateAuthUserInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.authUserController.update(input, req.tokenData!);
      return {
        statusCode: HttpStatus.OK,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteAuthUser(
    req: HttpRequest<FindAuthUserInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { email } = req.params;
      const response = await this.authUserController.delete({ email }, req.tokenData!);
      return {
        statusCode: HttpStatus.OK,
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
      const { email, password, role, masterId } = req.body;
      const response = await this.authUserController.login({
        email,
        password,
        role,
        masterId,
      });
      return {
        statusCode: HttpStatus.OK,
        body: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async checkRegistration(
    req: HttpRequest<{}, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const token = req.tokenData!;
      const response = await this.authUserController.checkUserRegistration(token);
      return {
        statusCode: HttpStatus.OK,
        body: { registered: response },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): HttpResponseData {
    return mapErrorToHttp(error);
  }
}
