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
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  HttpStatus,
  StatusMessageEnum,
} from '@/modules/@shared/enums/enums';
import { mapErrorToHttp } from '@/modules/@shared/infraestructure/http/error.mapper';

export class UserMasterRoute {
  constructor(
    private readonly userMasterController: UserMasterController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS = ['name', 'address', 'email', 'birthday', 'cnpj'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.post('/user-master', this.createUserMaster.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/user-master/:id', this.findUserMaster.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/user-master', this.updateUserMaster.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);
  }

  private async createUserMaster(
    req: HttpRequest<{}, {}, CreateUserMasterInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const reponse = await this.userMasterController.create(input, req.tokenData!);
      return { statusCode: HttpStatus.CREATED, body: reponse };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findUserMaster(
    req: HttpRequest<FindUserMasterInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.userMasterController.find({ id }, req.tokenData!);
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

  private async updateUserMaster(
    req: HttpRequest<{}, {}, UpdateUserMasterInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.userMasterController.update(input, req.tokenData!);

      return { statusCode: HttpStatus.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): HttpResponseData {
    return mapErrorToHttp(error);
  }
}
