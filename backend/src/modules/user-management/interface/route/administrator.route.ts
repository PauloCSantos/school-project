import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
} from '@/modules/@shared/infraestructure/http/http.interface';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { UserAdministratorController } from '../controller/administrator.controller';
import {
  CreateUserAdministratorInputDto,
  FindAllUserAdministratorInputDto,
  FindUserAdministratorInputDto,
  UpdateUserAdministratorInputDto,
  DeleteUserAdministratorInputDto,
} from '../../application/dto/administrator-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  HttpStatus,
  StatusMessageEnum,
} from '@/modules/@shared/enums/enums';
import { mapErrorToHttp } from '@/modules/@shared/infraestructure/http/error.mapper';

export class UserAdministratorRoute {
  constructor(
    private readonly userAdministratorController: UserAdministratorController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = [
      'name',
      'address',
      'email',
      'birthday',
      'salary',
      'graduation',
    ];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get(
      '/users-administrator',
      this.findAllUserAdministrators.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
      ]
    );

    this.httpGateway.post(
      '/user-administrator',
      this.createUserAdministrator.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
      ]
    );

    this.httpGateway.get(
      '/user-administrator/:id',
      this.findUserAdministrator.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
      ]
    );

    this.httpGateway.patch(
      '/user-administrator',
      this.updateUserAdministrator.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
      ]
    );

    this.httpGateway.delete(
      '/user-administrator/:id',
      this.deleteUserAdministrator.bind(this),
      [
        this.authMiddleware,
        createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
      ]
    );
  }

  private async findAllUserAdministrators(
    req: HttpRequest<{}, FindAllUserAdministratorInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.userAdministratorController.findAll(
        {
          quantity,
          offset,
        },
        req.tokenData!
      );
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserAdministrator(
    req: HttpRequest<FindUserAdministratorInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userAdministratorController.find(
        { id },
        req.tokenData!
      );
      if (!response) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createUserAdministrator(
    req: HttpRequest<{}, {}, CreateUserAdministratorInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.userAdministratorController.create(
        input,
        req.tokenData!
      );
      return { statusCode: HttpStatus.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async updateUserAdministrator(
    req: HttpRequest<{}, {}, UpdateUserAdministratorInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const updatedAdministrator = await this.userAdministratorController.update(
        input,
        req.tokenData!
      );
      return { statusCode: HttpStatus.OK, body: updatedAdministrator };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteUserAdministrator(
    req: HttpRequest<DeleteUserAdministratorInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userAdministratorController.delete(
        { id },
        req.tokenData!
      );
      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): HttpResponseData {
    return mapErrorToHttp(error);
  }
}
