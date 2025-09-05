import { HttpErrorResponse } from '@angular/common/http';
import {
  ApiErrorEnvelope,
  ApiErrorBody,
  isApiErrorEnvelope,
  isApiErrorBody,
} from '../models/api-error.model';

export function mapHttpError(err: HttpErrorResponse): ApiErrorEnvelope {
  const statusCode = err.status || 0;
  const payload = err.error;

  if (isApiErrorEnvelope(payload)) {
    return payload;
  }

  if (isApiErrorBody(payload)) {
    return { statusCode, body: payload };
  }

  const body: ApiErrorBody = {
    code: statusCode === 0 ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
    message:
      statusCode === 0
        ? 'Network or CORS failure. Check your connection.'
        : payload?.message ?? err.message ?? 'Unexpected error',
    details: payload ?? undefined,
  };

  return { statusCode, body };
}
