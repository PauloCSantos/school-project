import { isAppError } from '../../errors/errors';
import { HttpResponseData } from './http.interface';
import { HttpStatus } from '@/modules/@shared/enums/enums';

export function mapErrorToHttp(error: unknown): HttpResponseData {
  if (!(error instanceof Error)) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    };
  }

  if (isAppError(error)) {
    const status = kindToStatus(error.kind);

    return {
      statusCode: status,
      body: {
        code: error.code,
        message: error.message,
        details: error.details ?? undefined,
      },
    };
  }

  return {
    statusCode: HttpStatus.BAD_REQUEST,
    body: { code: 'BAD_REQUEST', message: error.message },
  };
}

function kindToStatus(kind: string): HttpStatus {
  switch (kind) {
    case 'NOT_FOUND':
      return HttpStatus.NOT_FOUND;
    case 'VALIDATION':
      return HttpStatus.UNPROCESSABLE_ENTITY;
    case 'CONFLICT':
      return HttpStatus.CONFLICT;
    case 'FORBIDDEN':
      return HttpStatus.FORBIDDEN;
    case 'UNAUTHORIZED':
      return HttpStatus.UNAUTHORIZED;
    case 'INTEGRATION':
      return HttpStatus.SERVICE_UNAVAILABLE;
    case 'BAD_REQUEST':
    case 'INVALID_ROLE':
      return HttpStatus.BAD_REQUEST;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
