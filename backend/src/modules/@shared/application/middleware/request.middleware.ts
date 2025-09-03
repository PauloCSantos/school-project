import { FunctionCalledEnum, HttpStatus } from '../../enums/enums';
import { validEmail, validId } from '../../utils/validations';
import {
  HttpMiddleware,
  HttpRequest,
  HttpResponseData,
} from '../../infraestructure/http/http.interface';
import { ErrorBody } from '../../type/sharedTypes';

const buildError = (
  status: HttpStatus,
  message: string,
  details?: ErrorBody['details'],
  code: ErrorBody['code'] = status === HttpStatus.UNPROCESSABLE_ENTITY
    ? 'VALIDATION_ERROR'
    : 'BAD_REQUEST'
) => ({
  statusCode: status,
  body: { code, message, details } as ErrorBody,
});

export default class RequestMiddleware implements HttpMiddleware<any, any, any, any> {
  constructor(
    private readonly fn: FunctionCalledEnum,
    private readonly requiredFields: string[]
  ) {}

  async handle(
    req: HttpRequest<any, any, any, any>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData> {
    switch (this.fn) {
      case FunctionCalledEnum.FIND_ALL: {
        const offset = req.query?.offset;
        const quantity = req.query?.quantity;
        if (offset !== undefined && (offset === '' || Number.isNaN(Number(offset)))) {
          return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid query param', {
            field: 'offset',
          });
        }
        if (
          quantity !== undefined &&
          (quantity === '' || Number.isNaN(Number(quantity)))
        ) {
          return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid query param', {
            field: 'quantity',
          });
        }
        break;
      }

      case FunctionCalledEnum.FIND: {
        const searchId = req.params?.id as string | undefined;
        const searchEmail = req.params?.email as string | undefined;
        if (!searchId && !searchEmail) {
          return buildError(HttpStatus.BAD_REQUEST, 'No parameters were passed to fetch');
        }
        if (searchEmail) {
          if (!validEmail(searchEmail)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid email', {
              field: 'email',
            });
          }
        } else {
          if (!validId(searchId!)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid id', {
              field: 'id',
            });
          }
        }
        break;
      }

      case FunctionCalledEnum.DELETE: {
        const idToDelete = req.params?.id as string | undefined;
        const emailToDelete = req.params?.email as string | undefined;
        if (!idToDelete && !emailToDelete) {
          return buildError(HttpStatus.BAD_REQUEST, 'No parameters were passed to fetch');
        }
        if (emailToDelete) {
          if (!validEmail(emailToDelete)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid email', {
              field: 'email',
            });
          }
        } else {
          if (!validId(idToDelete!)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid id', {
              field: 'id',
            });
          }
        }
        break;
      }

      case FunctionCalledEnum.CREATE: {
        for (const field of this.requiredFields) {
          if (req.body?.[field] === undefined) {
            return buildError(HttpStatus.BAD_REQUEST, 'Missing required field', {
              field,
            });
          }
        }
        break;
      }

      case FunctionCalledEnum.UPDATE: {
        const idToUpdate = req.body?.id as string | undefined;
        const emailToUpdate = req.body?.email as string | undefined;
        if (!idToUpdate && !emailToUpdate) {
          return buildError(HttpStatus.BAD_REQUEST, 'No parameters were passed to fetch');
        }
        let foundFields = 0;
        if (idToUpdate) {
          if (!validId(idToUpdate!)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid id', {
              field: 'id',
            });
          }
          for (const field of this.requiredFields) {
            if (req.body[field] !== undefined) {
              foundFields++;
            }
          }
        } else {
          if (!validEmail(emailToUpdate!)) {
            return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid email', {
              field: 'email',
            });
          }
          for (const field of this.requiredFields) {
            if (req.body.authUserDataToUpdate[field] !== undefined) {
              foundFields++;
            }
          }
        }

        if (foundFields === 0) {
          return buildError(
            HttpStatus.BAD_REQUEST,
            'At least one updatable field must be provided'
          );
        }

        break;
      }

      case FunctionCalledEnum.ADD:
      case FunctionCalledEnum.REMOVE: {
        for (const field of this.requiredFields) {
          if (req.body[field] === undefined) {
            return buildError(HttpStatus.BAD_REQUEST, 'Missing required field', {
              field,
            });
          }
          if (field === 'id') {
            if (!validId(req.body[field])) {
              return buildError(HttpStatus.UNPROCESSABLE_ENTITY, 'Invalid id', {
                field: 'id',
              });
            }
          } else {
            if (!Array.isArray(req.body[field])) {
              return buildError(
                HttpStatus.UNPROCESSABLE_ENTITY,
                'Field must be an array',
                { field }
              );
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
  fn: FunctionCalledEnum,
  requiredFields: string[]
): HttpMiddleware<any, any, any, any> {
  return new RequestMiddleware(fn, requiredFields);
}
