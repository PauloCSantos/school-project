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
  ADD = 'add',
  REMOVE = 'remove',
}

enum errorStatus {
  BADREQUEST = 400,
}

enum ErrorMessage {
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
    req: HttpRequest<any, any>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData> {
    switch (this.fn) {
      case FunctionCalled.FIND_ALL: {
        const offset = req.body?.offset;
        const limit = req.body?.limit;
        if (
          offset !== undefined &&
          (offset === '' || Number.isNaN(Number(offset)))
        ) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }
        if (
          limit !== undefined &&
          (limit === '' || Number.isNaN(Number(limit)))
        ) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }
        break;
      }

      case FunctionCalled.FIND: {
        const searchId = req.params?.id as string | undefined;
        const searchEmail = req.params?.email as string | undefined;
        if (!searchId && !searchEmail) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }
        if (searchEmail) {
          if (!validEmail(searchEmail)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
        } else {
          if (!validId(searchId!)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;
      }

      case FunctionCalled.DELETE: {
        const idToDelete = req.params?.id as string | undefined;
        const emailToDelete = req.params?.email as string | undefined;
        if (!idToDelete && !emailToDelete) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }
        if (emailToDelete) {
          if (!validEmail(emailToDelete)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
        } else {
          if (!validId(idToDelete!)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;
      }

      case FunctionCalled.CREATE: {
        for (const field of this.requiredFields) {
          if (req.body[field] === undefined) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
        }
        break;
      }

      case FunctionCalled.UPDATE: {
        const idToUpdate = req.body?.id as string | undefined;
        const emailToUpdate = req.body?.email as string | undefined;
        if (!idToUpdate && !emailToUpdate) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }
        let foundFields = 0;
        if (idToUpdate) {
          if (!validId(idToUpdate!)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
          for (const field of this.requiredFields) {
            if (req.body[field] !== undefined) {
              foundFields++;
            }
          }
        } else {
          if (!validEmail(emailToUpdate!)) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
          for (const field of this.requiredFields) {
            if (req.body.authUserDataToUpdate[field] !== undefined) {
              foundFields++;
            }
          }
        }

        if (foundFields === 0) {
          return {
            statusCode: errorStatus.BADREQUEST,
            body: { error: ErrorMessage.BADREQUEST },
          };
        }

        break;
      }

      case FunctionCalled.ADD:
      case FunctionCalled.REMOVE: {
        for (const field of this.requiredFields) {
          if (req.body[field] === undefined) {
            return {
              statusCode: errorStatus.BADREQUEST,
              body: { error: ErrorMessage.BADREQUEST },
            };
          }
          if (field === 'id') {
            if (!validId(req.body[field])) {
              return {
                statusCode: errorStatus.BADREQUEST,
                body: { error: ErrorMessage.BADREQUEST },
              };
            }
          } else {
            if (!Array.isArray(req.body[field])) {
              return {
                statusCode: errorStatus.BADREQUEST,
                body: { error: ErrorMessage.BADREQUEST },
              };
            }
          }
        }

        break;
      }
    }

    return next();
  }
}

export function createRequestMiddleware(
  fn: FunctionCalled,
  requiredFields: string[]
): HttpMiddleware<any, any, any, any> {
  return new RequestMiddleware(fn, requiredFields);
}
