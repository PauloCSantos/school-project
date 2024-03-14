import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';

describe('AuthUserMiddleware unit test', () => {
  const mockNext = jest.fn();

  const mockReq = {
    headers: {
      authorization: '',
    },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    const tokenService = new TokenService('PxHf3H7');
    const allowedRoles: RoleUsers[] = ['master'];
    middleware = new AuthUserMiddleware(tokenService, allowedRoles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if token is missing', async () => {
    await middleware.handle(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Missing Token' });
  });

  test('should return 401 if token is invalid', async () => {
    mockReq.headers.authorization = 'Bearer invalidToken';
    await middleware.handle(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  test('should return 403 if user does not have access permission', async () => {
    mockReq.headers.authorization =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6IjJlMjM3YTNmLTJjMzMtNDg0MC04N2U5LTU3YjdmNmEwZWU4MiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE3MTAzNTMzNzIsImV4cCI6MTcxMDM1NTE3Mn0.74reo03_nrxiQCZUsp3RDtwS066HyxPyXwEivEHzA3E';
    await middleware.handle(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User does not have access permission',
    });
  });

  test('should call next if token is valid and user has access permission', async () => {
    mockReq.headers.authorization =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImRmOWQxN2I1LWM0NTctNGEwYy04ZDA4LWVlMmEzMTM1NjVmMyIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDM1MzQ2NywiZXhwIjoxNzEwMzU1MjY3fQ.5LaO4C4OEFrsj7fh5CAIdf279Q5O2zueDG6EwHomFik';
    const next = jest.fn();
    await middleware.handle(mockReq, mockRes, next);
    expect(next).toHaveBeenCalled();
  });
});
