import TokenServiceInterface from '../../../authentication-authorization-management/application/service/token.service';
import { isNotEmpty } from '../../utils/validations';
import {
  HttpRequest,
  HttpResponseData,
  HttpMiddleware,
} from '../../infraestructure/http/http.interface';
import { RoleUsers } from '../../type/sharedTypes';
import { ErrorMessage, HttpStatus } from '../../enums/enums';

export default class AuthUserMiddleware
  implements HttpMiddleware<any, any, any, any>
{
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
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: { message: ErrorMessage.MISSING_TOKEN },
      };
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    let decoded;
    try {
      decoded = await this.tokenService.validateToken(token);
    } catch {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: { message: ErrorMessage.INVALID_TOKEN },
      };
    }

    if (!decoded) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        body: { message: ErrorMessage.INVALID_TOKEN },
      };
    }

    if (
      this.allowedRoles.length > 0 &&
      !this.allowedRoles.includes(decoded.role as RoleUsers)
    ) {
      return {
        statusCode: HttpStatus.FORBIDDEN,
        body: { message: ErrorMessage.ACCESS_DENIED },
      };
    }

    req.tokenData = {
      email: decoded.email,
      role: decoded.role as RoleUsers,
      masterId: decoded.masterId,
    };
    return next();
  }
}
