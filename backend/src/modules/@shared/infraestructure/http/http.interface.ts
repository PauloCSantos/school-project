export interface HttpRequest<P = any, Q = any, B = any, H = any> {
  params: P;
  query: Q;
  body: B;
  headers: H;
}

export interface HttpResponseData {
  statusCode: number;
  body: any;
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
 * Abstração de servidor HTTP para registrar rotas e middlewares.
 */
export interface HttpServer {
  get(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  post(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  patch(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
  delete(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void;
}
