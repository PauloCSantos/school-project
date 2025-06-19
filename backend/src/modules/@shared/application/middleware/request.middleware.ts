import {
  HttpMiddleware,
  HttpRequest,
  HttpResponseData,
} from '../../infraestructure/http/http.interface';
import { validEmail, validId } from '../../utils/validations';

export enum FunctionCalled {
  FIND_ALL = 'findAll',
  FIND = 'find',
  DELETE = 'delete',
  CREATE = 'create',
  UPDATE = 'update',
}

export enum errorStatus {
  BADREQUEST = 400,
}

export enum ErrorMessage {
  BADREQUEST = 'Bad Request',
}

export default class RequestMiddleware
  implements HttpMiddleware<any, any, any, any>
{
  constructor(
    private readonly fn: FunctionCalled,
    private readonly requiredFields: string[]
  ) {}

  async handle(
    req: HttpRequest<any, any, any, any>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData> {
    switch (this.fn) {
      case FunctionCalled.FIND_ALL:
        const offset = req.query?.offset;
        const limit = req.query?.limit;
        if (offset !== undefined && isNaN(Number(offset))) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { message: ErrorMessage.BADREQUEST },
          };
        }
        if (limit !== undefined && isNaN(Number(limit))) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { message: ErrorMessage.BADREQUEST },
          };
        }
        break;

      case FunctionCalled.FIND:
        const searchId = req.params?.id as string | undefined;
        const searchEmail = req.params?.email as string | undefined;
        if (!searchId && !searchEmail) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { message: ErrorMessage.BADREQUEST },
          };
        }
        if (searchEmail) {
          if (!validEmail(searchEmail)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { message: ErrorMessage.BADREQUEST },
            };
          }
        } else {
          if (!validId(searchId!)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { message: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;

      case FunctionCalled.DELETE:
        const idToDelete = req.params?.id as string | undefined;
        if (!idToDelete || !validId(idToDelete)) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { message: ErrorMessage.BADREQUEST },
          };
        }
        break;

      case FunctionCalled.CREATE:
        for (const field of this.requiredFields) {
          if (req.body[field] === undefined) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { message: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;

      case FunctionCalled.UPDATE:
        const idToUpdate = req.params?.id as string | undefined;
        if (!idToUpdate || !validId(idToUpdate)) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { message: ErrorMessage.BADREQUEST },
          };
        }
        for (const field of this.requiredFields) {
          if (req.body[field] === undefined) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { message: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;
    }

    return next();
  }
}

export function createRequestMiddleware(
  fn: FunctionCalled,
  requiredFields: string[]
) {
  const mw = new RequestMiddleware(fn, requiredFields);
  return mw.handle.bind(mw);
}
