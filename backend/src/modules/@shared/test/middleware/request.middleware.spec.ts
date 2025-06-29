import RequestMiddleware, {
  FunctionCalled,
} from '../../application/middleware/request.middleware';
import * as validations from '../../utils/validations';

jest.mock('../../utils/validations', () => ({
  validEmail: jest.fn(),
  validId: jest.fn(),
}));

describe('RequestMiddleware unit test', () => {
  let middleware: RequestMiddleware;
  let mockReq: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockNext = jest.fn().mockResolvedValue(undefined);
    (validations.validEmail as jest.Mock).mockReset();
    (validations.validId as jest.Mock).mockReset();
  });

  describe('FIND_ALL', () => {
    beforeEach(() => {
      middleware = new RequestMiddleware(FunctionCalled.FIND_ALL, []);
    });

    test('should return bad request if offset is not a number', async () => {
      mockReq.query = { offset: 'abc' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return bad request if quantity is not a number', async () => {
      mockReq.query = { quantity: 'xyz' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if offset and quantity are valid or absent', async () => {
      await middleware.handle(mockReq, mockNext);
      expect(mockNext).toHaveBeenCalled();
      mockNext.mockClear();
      mockReq.body = { offset: '5', quantity: '10' };
      await middleware.handle(mockReq, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('FIND', () => {
    beforeEach(() => {
      middleware = new RequestMiddleware(FunctionCalled.FIND, []);
    });

    test('should return bad request if id and email are missing', async () => {
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return bad request if email is invalid', async () => {
      (validations.validEmail as jest.Mock).mockReturnValue(false);
      mockReq.params = { email: 'invalid' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(validations.validEmail).toHaveBeenCalledWith('invalid');
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if email is valid', async () => {
      (validations.validEmail as jest.Mock).mockReturnValue(true);
      mockReq.params = { email: 'user@example.com' };
      await middleware.handle(mockReq, mockNext);
      expect(validations.validEmail).toHaveBeenCalledWith('user@example.com');
      expect(mockNext).toHaveBeenCalled();
    });

    test('should return bad request if id is invalid', async () => {
      (validations.validEmail as jest.Mock).mockReturnValue(true);
      (validations.validId as jest.Mock).mockReturnValue(false);
      mockReq.params = { id: 'badId' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('badId');
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if id is valid', async () => {
      (validations.validId as jest.Mock).mockReturnValue(true);
      mockReq.params = { id: '123' };
      await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    beforeEach(() => {
      middleware = new RequestMiddleware(FunctionCalled.DELETE, []);
    });

    test('should return bad request if id is missing', async () => {
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return bad request if id is invalid', async () => {
      (validations.validId as jest.Mock).mockReturnValue(false);
      mockReq.params = { id: 'bad' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('bad');
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if id is valid', async () => {
      (validations.validId as jest.Mock).mockReturnValue(true);
      mockReq.params = { id: '123' };
      await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('CREATE', () => {
    beforeEach(() => {
      middleware = new RequestMiddleware(FunctionCalled.CREATE, ['name']);
    });

    test('should return bad request if required field is missing', async () => {
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if required field is present', async () => {
      mockReq.body = { name: 'test' };
      await middleware.handle(mockReq, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('UPDATE', () => {
    beforeEach(() => {
      middleware = new RequestMiddleware(FunctionCalled.UPDATE, ['name']);
    });

    test('should return bad request if id is missing', async () => {
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return bad request if id is invalid', async () => {
      (validations.validId as jest.Mock).mockReturnValue(false);
      mockReq.body = { id: 'bad' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('bad');
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return bad request if required field is missing', async () => {
      (validations.validId as jest.Mock).mockReturnValue(true);
      mockReq.params = { id: '123' };
      const res = await middleware.handle(mockReq, mockNext);
      expect(res).toEqual({
        statusCode: 400,
        body: { error: 'Bad Request' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next if id is valid and required field is present', async () => {
      (validations.validId as jest.Mock).mockReturnValue(true);
      mockReq.body = { id: '123', name: 'test' };
      await middleware.handle(mockReq, mockNext);
      expect(validations.validId).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
