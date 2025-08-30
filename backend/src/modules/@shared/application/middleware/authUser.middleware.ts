import TokenServiceInterface from '../../../authentication-authorization-management/infrastructure/services/token.service';
import { isNotEmpty } from '../../utils/validations';
import {
  HttpRequest,
  HttpResponseData,
  HttpMiddleware,
} from '../../infraestructure/http/http.interface';
import { ErrorBody, ErrorKind, RoleUsers } from '../../type/sharedTypes';
import { ErrorKindEnum, ErrorMessage, HttpStatus } from '../../enums/enums';

type ErrorAuthUser = {
  statusCode: number;
  body: ErrorBody;
};
export default class AuthUserMiddleware implements HttpMiddleware<any, any, any, any> {
  constructor(
    private readonly tokenService: TokenServiceInterface,
    private readonly allowedRoles: RoleUsers[] = []
  ) {}

  public async handle(
    request: HttpRequest<any, any, any, any>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData> {
    const req = request as HttpRequest;
    const authHeader = req.headers?.authorization;

    if (!authHeader || !isNotEmpty(authHeader)) {
      return this.buildError(
        HttpStatus.UNAUTHORIZED,
        ErrorMessage.MISSING_TOKEN,
        ErrorKindEnum.UNAUTHORIZED
      );
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    let decoded;
    try {
      decoded = await this.tokenService.validateToken(token);
    } catch {
      return this.buildError(
        HttpStatus.UNAUTHORIZED,
        ErrorMessage.INVALID_TOKEN,
        ErrorKindEnum.UNAUTHORIZED
      );
    }

    if (!decoded) {
      return this.buildError(
        HttpStatus.UNAUTHORIZED,
        ErrorMessage.INVALID_TOKEN,
        ErrorKindEnum.UNAUTHORIZED
      );
    }

    if (
      this.allowedRoles.length > 0 &&
      !this.allowedRoles.includes(decoded.role as RoleUsers)
    ) {
      return this.buildError(
        HttpStatus.FORBIDDEN,
        ErrorMessage.ACCESS_DENIED,
        ErrorKindEnum.FORBIDDEN
      );
    }

    req.tokenData = {
      email: decoded.email,
      role: decoded.role as RoleUsers,
      masterId: decoded.masterId,
    };
    return next();
  }

  private buildError(
    status: HttpStatus,
    message: string,
    code: ErrorKind,
    details?: ErrorBody['details']
  ): ErrorAuthUser {
    return {
      statusCode: status,
      body: { code, message, details } as ErrorBody,
    };
  }
}
