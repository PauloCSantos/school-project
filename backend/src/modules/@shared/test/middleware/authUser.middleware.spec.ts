import TokenService from '../../../authentication-authorization-management/application/service/token.service';
import AuthUserMiddleware from '../../application/middleware/authUser.middleware';
import TokenServiceInterface from '../../../authentication-authorization-management/application/service/token.service';
import { RoleUsers } from '../../type/sharedTypes';
import { HttpRequest } from '../../infraestructure/http/http.interface';
import { RoleUsersEnum } from '../../enums/enums';

describe('AuthUserMiddleware unit test', () => {
  let middleware: AuthUserMiddleware;
  let mockReq: HttpRequest;
  let mockNext: jest.Mock;
  let tokenService: TokenServiceInterface;

  const allowedRoles: RoleUsers[] = [RoleUsersEnum.ADMINISTRATOR];

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: '',
      },
      body: {},
      params: {},
      query: {},
      tokenData: undefined,
    };

    mockNext = jest.fn();
    tokenService = new TokenService('PxHf3H7');

    jest
      .spyOn(tokenService, 'validateToken')
      .mockImplementation(async (token: string): Promise<any | null> => {
        if (token === 'validTokenWithAdminRole') {
          return {
            masterId: 'admin-id',
            email: 'admin@test.com',
            role: RoleUsersEnum.ADMINISTRATOR,
          };
        }
        if (token === 'validTokenWithUserRole') {
          return {
            masterId: 'user-id',
            email: 'user@test.com',
            role: RoleUsersEnum.WORKER,
          };
        }
        if (token === 'tokenThatReturnsNull') {
          return null;
        }
        throw new Error('Simulated Invalid Token Error');
      });

    middleware = new AuthUserMiddleware(tokenService, allowedRoles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set tokenData to undefined and not call next if token is missing', async () => {
    mockReq.headers.authorization = '';
    await middleware.handle(mockReq, mockNext);

    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should set tokenData to undefined and not call next if authorization header is missing', async () => {
    mockReq.headers = {};
    await middleware.handle(mockReq, mockNext);

    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should set tokenData to undefined and not call next if token is invalid (validateToken returns null)', async () => {
    mockReq.headers.authorization = 'Bearer tokenThatReturnsNull';
    await middleware.handle(mockReq, mockNext);

    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should set tokenData to undefined and not call next if token is invalid (validateToken throws error)', async () => {
    mockReq.headers.authorization = 'Bearer invalidTokenByThrowing';
    await middleware.handle(mockReq, mockNext);

    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should set tokenData to undefined and not call next if role is not allowed', async () => {
    mockReq.headers.authorization = 'Bearer validTokenWithUserRole';
    await middleware.handle(mockReq, mockNext);

    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should call next and attach tokenData to request if token is valid and role is allowed', async () => {
    mockReq.headers.authorization = 'Bearer validTokenWithAdminRole';
    await middleware.handle(mockReq, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockReq.tokenData).toEqual({
      masterId: 'admin-id',
      email: 'admin@test.com',
      role: RoleUsersEnum.ADMINISTRATOR,
    });
  });

  test('should set tokenData to undefined and not call next if an unexpected error occurs (e.g., in hasPermission or extractToken, though less likely with current structure)', async () => {
    jest
      .spyOn(tokenService, 'validateToken')
      .mockImplementationOnce(async () => {
        throw new Error('Another Unexpected Error');
      });

    mockReq.headers.authorization = 'Bearer someTokenCausingUnexpectedError';
    await middleware.handle(mockReq, mockNext);
    expect(mockReq.tokenData).toBeUndefined();
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should correctly extract token if "Bearer " prefix is missing (though not standard)', async () => {
    mockReq.headers.authorization = 'validTokenWithAdminRole';

    await middleware.handle(mockReq, mockNext);

    expect(tokenService.validateToken).toHaveBeenCalledWith(
      'validTokenWithAdminRole'
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockReq.tokenData).toEqual({
      masterId: 'admin-id',
      email: 'admin@test.com',
      role: RoleUsersEnum.ADMINISTRATOR,
    });
  });
});
