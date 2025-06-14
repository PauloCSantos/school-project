import { validId } from '@/modules/@shared/utils/validations';
import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserWorkerController } from '../controller/worker.controller';
import {
  CreateUserWorkerInputDto,
  FindAllUserWorkerInputDto,
  FindUserWorkerInputDto,
  UpdateUserWorkerInputDto,
  DeleteUserWorkerInputDto,
} from '../../application/dto/worker-usecase.dto';

export class UserWorkerRoute {
  constructor(
    private readonly userWorkerController: UserWorkerController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/users-worker',
      this.findAllUserWorkers.bind(this),
      this.authMiddleware
    );

    this.httpGateway.post(
      '/user-worker',
      this.createUserWorker.bind(this),
      this.authMiddleware
    );

    this.httpGateway.get(
      '/user-worker/:id',
      this.findUserWorker.bind(this),
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/user-worker/:id',
      this.updateUserWorker.bind(this),
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/user-worker/:id',
      this.deleteUserWorker.bind(this),
      this.authMiddleware
    );
  }

  private async findAllUserWorkers(
    req: HttpRequest<{}, {}, FindAllUserWorkerInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset incorretos' },
        };
      }
      const workers = await this.userWorkerController.findAll({
        quantity,
        offset,
      });
      return { statusCode: 200, body: workers };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserWorker(
    req: HttpRequest<FindUserWorkerInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const worker = await this.userWorkerController.find({ id });
      return { statusCode: 200, body: worker };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createUserWorker(
    req: HttpRequest<{}, {}, CreateUserWorkerInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação do worker' },
        };
      }
      const newWorker = await this.userWorkerController.create(input);
      return { statusCode: 201, body: newWorker };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserWorker(
    req: HttpRequest<FindUserWorkerInputDto, {}, UpdateUserWorkerInputDto, {}>
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
      const updatedWorker = await this.userWorkerController.update({
        ...input,
        id,
      });
      return { statusCode: 200, body: updatedWorker };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserWorker(
    req: HttpRequest<DeleteUserWorkerInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const deleted = await this.userWorkerController.delete({ id });
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

  private validateCreate(input: CreateUserWorkerInputDto): boolean {
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
      typeof input.salary.salary !== 'number'
    ) {
      return false;
    }
    return true;
  }

  private validFind(id: string): boolean {
    return validId(id);
  }

  private validUpdate(id: string, input: UpdateUserWorkerInputDto): boolean {
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
