import { validId } from '@/modules/@shared/utils/validations';
import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserMasterController } from '../controller/master.controller';
import {
  CreateUserMasterInputDto,
  FindUserMasterInputDto,
  UpdateUserMasterInputDto,
} from '../../application/dto/master-usecase.dto';

export class UserMasterRoute {
  constructor(
    private readonly userMasterController: UserMasterController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.post(
      '/user-master',
      this.createUserMaster.bind(this),
      this.authMiddleware
    );

    this.httpGateway.get(
      '/user-master/:id',
      this.findUserMaster.bind(this),
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/user-master/:id',
      this.updateUserMaster.bind(this),
      this.authMiddleware
    );
  }

  private async createUserMaster(
    req: HttpRequest<{}, {}, CreateUserMasterInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação do master' },
        };
      }
      const newMaster = await this.userMasterController.create(input);
      return { statusCode: 201, body: newMaster };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserMaster(
    req: HttpRequest<FindUserMasterInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const master = await this.userMasterController.find({ id });
      return { statusCode: 200, body: master };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserMaster(
    req: HttpRequest<FindUserMasterInputDto, {}, UpdateUserMasterInputDto, {}>
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
      const updatedMaster = await this.userMasterController.update({
        ...input,
        id,
      });
      return { statusCode: 200, body: updatedMaster };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateCreate(input: CreateUserMasterInputDto): boolean {
    return (
      input.name.firstName !== undefined &&
      input.name.lastName !== undefined &&
      input.address.street !== undefined &&
      input.address.city !== undefined &&
      input.address.zip !== undefined &&
      input.address.number !== undefined &&
      input.address.avenue !== undefined &&
      input.address.state !== undefined &&
      input.email !== undefined &&
      input.birthday !== undefined &&
      input.cnpj !== undefined
    );
  }

  private validFind(id: string): boolean {
    return validId(id);
  }

  private validUpdate(id: string, input: UpdateUserMasterInputDto): boolean {
    if (!validId(id)) return false;
    return Object.values(input).some(value => value !== undefined);
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
