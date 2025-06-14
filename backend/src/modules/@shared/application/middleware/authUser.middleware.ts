import TokenService from '../../infraestructure/service/token.service';
import { isNotEmpty } from '../../utils/validations';
import {
  HttpRequest,
  HttpResponseData,
  HttpMiddleware,
} from '../../infraestructure/http/http.interface';
import { IncomingHttpHeaders } from 'http';
import { RoleUsers } from '../../type/enum';

enum HttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

enum ErrorMessage {
  MISSING_TOKEN = 'Missing Token',
  INVALID_TOKEN = 'Invalid token',
  ACCESS_DENIED = 'User does not have access permission',
  INTERNAL_ERROR = 'Internal server error',
}

interface TokenData {
  email: string;
  role: RoleUsers;
  masterId: string;
}

export interface AuthHttpRequest<
  P = any,
  Q = any,
  B = any,
  H = IncomingHttpHeaders,
> extends HttpRequest<P, Q, B, H> {
  tokenData?: TokenData;
}

export default class AuthUserMiddleware
  implements HttpMiddleware<any, any, any, any>
{
  constructor(
    private readonly tokenService: TokenService,
    private readonly allowedRoles: RoleUsers[] = []
  ) {}

  public async handle(
    request: HttpRequest<any, any, any, any>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData> {
    const req = request as AuthHttpRequest;
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
