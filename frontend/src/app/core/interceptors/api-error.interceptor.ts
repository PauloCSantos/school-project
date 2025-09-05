import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { mapHttpError } from '../mappers/http-error.mapper';

export class ApiError extends Error {
  constructor(public envelope: ReturnType<typeof mapHttpError>) {
    super(envelope.body.message);
    this.name = 'ApiError';
  }
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const mapped = mapHttpError(err);
      return throwError(() => new ApiError(mapped));
    })
  );
