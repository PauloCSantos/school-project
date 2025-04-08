import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';
import AuthUserMiddleware, {
  AuthHttpRequest,
  HttpStatus,
  NextFunction,
} from '../../application/middleware/authUser.middleware';
import { HttpResponse } from '../../infraestructure/http/http.interface';

describe('AuthUserMiddleware unit test', () => {
  let middleware: AuthUserMiddleware;
  let mockReq: AuthHttpRequest;
  let mockRes: HttpResponse;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: '',
      },
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    const tokenService = new TokenService('PxHf3H7');

    jest
      .spyOn(tokenService, 'validateToken')
      .mockImplementation(async (token: string) => {
        if (token === 'validTokenWithPermission') {
          return {
            masterId: 'some-id',
            email: 'test@test.com',
            role: 'master',
          };
        }

        if (token === 'validTokenWithoutPermission') {
          return {
            masterId: 'some-id',
            email: 'test@test.com',
            role: 'teacher',
          };
        }

        return null;
      });

    const allowedRoles: RoleUsers[] = ['master'];
    middleware = new AuthUserMiddleware(tokenService, allowedRoles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when token is missing', () => {
    test('should return 401 and not call next', async () => {
      mockReq.headers.authorization = '';
      await middleware.handle(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing Token' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when token is invalid', () => {
    test('should return 401 and not call next', async () => {
      mockReq.headers.authorization = 'Bearer invalidToken';
      await middleware.handle(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when token is valid but user lacks permission', () => {
    test('should return 403 and not call next', async () => {
      mockReq.headers.authorization = 'Bearer validTokenWithoutPermission';
      await middleware.handle(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User does not have access permission',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when token is valid and user has permission', () => {
    test('should call next and attach user to request', async () => {
      mockReq.headers.authorization = 'Bearer validTokenWithPermission';
      await middleware.handle(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
