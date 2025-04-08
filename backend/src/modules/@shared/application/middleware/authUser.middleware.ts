import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';
import { isNotEmpty } from '../../utils/validations';
import {
  HttpRequest,
  HttpResponse,
} from '../../infraestructure/http/http.interface';
import { HttpMiddleware } from '../../infraestructure/http/express.adapter';

export enum HttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessage {
  MISSING_TOKEN = 'Missing Token',
  INVALID_TOKEN = 'Invalid token',
  ACCESS_DENIED = 'User does not have access permission',
  INTERNAL_ERROR = 'Internal server error',
}

export interface TokenData {
  email: string;
  role: RoleUsers;
  masterId: string;
}

export interface AuthHttpRequest extends HttpRequest {
  tokenData?: TokenData;
}

export type NextFunction = () => void;

export default class AuthUserMiddleware implements HttpMiddleware {
  private readonly logger: Console;

  constructor(
    private readonly tokenService: TokenService,
    private readonly allowedRoles: RoleUsers[],
    logger: Console = console
  ) {
    this.logger = logger;
  }

  public async handle(
    req: AuthHttpRequest,
    res: HttpResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokenData = await this.extractAndValidateToken(req);
      if (!this.hasPermission(tokenData.role)) {
        return this.sendErrorResponse(
          res,
          HttpStatus.FORBIDDEN,
          ErrorMessage.ACCESS_DENIED
        );
      }

      req.tokenData = tokenData;
      next();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private async extractAndValidateToken(
    req: AuthHttpRequest
  ): Promise<TokenData> {
    const authorizationHeader = req.headers?.authorization;

    if (!authorizationHeader || !isNotEmpty(authorizationHeader)) {
      throw new Error(ErrorMessage.MISSING_TOKEN);
    }

    const token = this.extractToken(authorizationHeader);
    const decodedToken = await this.tokenService.validateToken(token);

    if (!decodedToken) {
      throw new Error(ErrorMessage.INVALID_TOKEN);
    }

    return {
      email: decodedToken.email,
      role: decodedToken.role as RoleUsers,
      masterId: decodedToken.masterId,
    };
  }

  private extractToken(authHeader: string): string {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return authHeader;
  }

  private hasPermission(role: RoleUsers): boolean {
    return this.allowedRoles.includes(role);
  }

  private handleError(error: unknown, res: HttpResponse): void {
    if (error instanceof Error) {
      switch (error.message) {
        case ErrorMessage.MISSING_TOKEN:
        case ErrorMessage.INVALID_TOKEN:
          return this.sendErrorResponse(
            res,
            HttpStatus.UNAUTHORIZED,
            error.message
          );
        case ErrorMessage.ACCESS_DENIED:
          return this.sendErrorResponse(
            res,
            HttpStatus.FORBIDDEN,
            error.message
          );
        default:
          this.logger.error('Authentication error:', error);
          return this.sendErrorResponse(
            res,
            HttpStatus.INTERNAL_SERVER_ERROR,
            ErrorMessage.INTERNAL_ERROR
          );
      }
    }

    this.logger.error('Unknown authentication error:', error);
    this.sendErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.INTERNAL_ERROR
    );
  }

  private sendErrorResponse(
    res: HttpResponse,
    statusCode: HttpStatus,
    message: string
  ): void {
    res.status(statusCode).json({ error: message });
  }
}
