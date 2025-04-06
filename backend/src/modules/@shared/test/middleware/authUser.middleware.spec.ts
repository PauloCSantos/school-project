import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';
import AuthUserMiddleware, {
  AuthRequest,
} from '../../application/middleware/authUser.middleware';
import { Response, NextFunction } from 'express';

describe('AuthUserMiddleware unit test', () => {
  const mockNext = jest.fn() as NextFunction;

  // Criar um mock mais completo que corresponda à interface AuthRequest
  const mockReq = {
    headers: {
      authorization: '',
    },
    // Adicionar propriedades mínimas necessárias da interface Request
    body: {},
    params: {},
    query: {},
    // Outras propriedades podem ser necessárias dependendo do uso
  } as unknown as AuthRequest;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6IjNmZTVlN2RmLWRjYTUtNDMxMS1iNWVjLWNmYTZlYzUwNjk4YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3MTA1MjI0MzEsImV4cCI6MTc1MzcyMjQzMX0.v7br5iCFnn4p_1UUI2mLbu5zgAm7Kpv0no9uMLuC5DE';
    await middleware.handle(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User does not have access permission',
    });
  });

  test('should call next if token is valid and user has access permission', async () => {
    mockReq.headers.authorization =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng';
    const next = jest.fn() as NextFunction;
    await middleware.handle(mockReq, mockRes, next);
    expect(next).toHaveBeenCalled();
  });
});
