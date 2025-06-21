import { RoleUsers } from '../../type/enum';

export interface HttpRequest<P = any, Q = any, B = any, H = any> {
  params: P;
  query: Q;
  body: B;
  headers: H;
  tokenData?: TokenData;
}

export interface HttpResponseData {
  statusCode: number;
  body: any;
}

interface TokenData {
  email: string;
  role: RoleUsers;
  masterId: string;
}

export interface HttpMiddleware<P = any, Q = any, B = any, H = any> {
  handle(
    request: HttpRequest<P, Q, B, H>,
    next: () => Promise<HttpResponseData>
  ): Promise<HttpResponseData>;
}

export interface HttpController<P = any, Q = any, B = any, H = any> {
  handle(request: HttpRequest<P, Q, B, H>): Promise<HttpResponseData>;
}

/**
 * HTTP server abstraction for registering routes and middlewares.
 */
export interface HttpServer {
  get(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  post(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  patch(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  delete(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
}
