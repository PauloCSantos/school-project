import { validId } from '@/modules/@shared/utils/validations';
import {
  HttpServer,
  HttpResponseData,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware, {
  AuthHttpRequest,
  AuthErrorHandlerMiddleware,
} from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserAdministratorController } from '../controller/administrator.controller';
import {
  CreateUserAdministratorInputDto,
  FindAllUserAdministratorInputDto,
  FindUserAdministratorInputDto,
  UpdateUserAdministratorInputDto,
  DeleteUserAdministratorInputDto,
} from '../../application/dto/administrator-usecase.dto';

export class UserAdministratorRoute {
  constructor(
    private readonly userAdministratorController: UserAdministratorController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const errorHandler = new AuthErrorHandlerMiddleware();

    this.httpGateway.get(
      '/users-administrator',
      this.findAllUserAdministrators.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.post(
      '/user-administrator',
      this.createUserAdministrator.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.get(
      '/user-administrator/:id',
      this.findUserAdministrator.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/user-administrator/:id',
      this.updateUserAdministrator.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/user-administrator/:id',
      this.deleteUserAdministrator.bind(this),
      errorHandler,
      this.authMiddleware
    );
  }

  private async findAllUserAdministrators(
    req: AuthHttpRequest<{}, {}, FindAllUserAdministratorInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const administrators = await this.userAdministratorController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: administrators };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserAdministrator(
    req: AuthHttpRequest<FindUserAdministratorInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const administrator = await this.userAdministratorController.find({ id });
      return { statusCode: 200, body: administrator };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createUserAdministrator(
    req: AuthHttpRequest<{}, {}, CreateUserAdministratorInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação do administrador' },
        };
      }
      const newAdministrator =
        await this.userAdministratorController.create(input);
      return { statusCode: 201, body: newAdministrator };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserAdministrator(
    req: AuthHttpRequest<
      FindUserAdministratorInputDto,
      {},
      UpdateUserAdministratorInputDto,
      {}
    >
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const updatedAdministrator =
        await this.userAdministratorController.update({ ...input, id });
      return { statusCode: 200, body: updatedAdministrator };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserAdministrator(
    req: AuthHttpRequest<
      FindUserAdministratorInputDto,
      {},
      DeleteUserAdministratorInputDto,
      {}
    >
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const deleted = await this.userAdministratorController.delete({ id });
      return { statusCode: 200, body: deleted };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateFindAll(quantity?: number, offset?: number): boolean {
    if (quantity === undefined || offset === undefined) {
      return true;
    }
    return Number.isInteger(quantity) && Number.isInteger(offset);
  }

  private validateCreate(input: CreateUserAdministratorInputDto): boolean {
    if (
      !input.name ||
      typeof input.name.firstName !== 'string' ||
      typeof input.name.lastName !== 'string' ||
      !input.address ||
      typeof input.address.street !== 'string' ||
      typeof input.address.city !== 'string' ||
      typeof input.address.zip !== 'string' ||
      typeof input.address.number !== 'number' ||
      typeof input.address.avenue !== 'string' ||
      typeof input.address.state !== 'string' ||
      !input.email ||
      typeof input.email !== 'string' ||
      !input.birthday ||
      typeof input.birthday !== 'string' ||
      !input.salary ||
      typeof input.salary.salary !== 'number' ||
      !input.graduation ||
      typeof input.graduation !== 'string'
    ) {
      return false;
    }
    return true;
  }

  private validFind(id: string): boolean {
    return validId(id);
  }

  private validUpdate(
    id: string,
    input: UpdateUserAdministratorInputDto
  ): boolean {
    if (!validId(id)) return false;
    return Object.values(input).some(value => value !== undefined);
  }

  private validDelete(id: string): boolean {
    return validId(id);
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
