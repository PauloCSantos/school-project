export type ApiErrorCode = string;

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  statusCode: number;
  body: ApiErrorBody;
}

export interface ApiSuccessEnvelope<T> {
  statusCode: number;
  body: T;
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export const isApiErrorEnvelope = (v: any): v is ApiErrorEnvelope =>
  !!v && typeof v.statusCode === 'number' && !!v.body && typeof v.body.code === 'string';

export const isApiErrorBody = (v: any): v is ApiErrorBody =>
  !!v && typeof v.code === 'string' && typeof v.message === 'string';
