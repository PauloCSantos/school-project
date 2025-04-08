import express, { NextFunction, Request, Response } from 'express';
import { HttpInterface, HttpRequest, HttpResponse } from './http.interface';

export interface HttpMiddleware {
  handle(req: HttpRequest, res: HttpResponse, next: () => void): Promise<void>;
}

export default class ExpressHttp implements HttpInterface {
  private app = express();

  constructor() {
    this.app.use(express.json());
  }

  /**
   * Adapta um middleware de domínio para o formato do Express
   */
  adaptMiddleware(middleware: HttpMiddleware) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
      };

      try {
        await middleware.handle(httpRequest, res, () => next());
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Método para registrar um middleware global
   */
  use(middleware: HttpMiddleware): void {
    this.app.use(this.adaptMiddleware(middleware));
  }

  /**
   * Método para registrar um middleware em um caminho específico
   */
  useOn(path: string, middleware: HttpMiddleware): void {
    this.app.use(path, this.adaptMiddleware(middleware));
  }

  /**
   * Métodos HTTP com suporte a middlewares
   */
  get(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void,
    ...middlewares: HttpMiddleware[]
  ): void {
    const adaptedMiddlewares = middlewares.map(m => this.adaptMiddleware(m));

    this.app.get(path, ...adaptedMiddlewares, (req: Request, res: Response) =>
      handler(req, res)
    );
  }

  post(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void,
    ...middlewares: HttpMiddleware[]
  ): void {
    const adaptedMiddlewares = middlewares.map(m => this.adaptMiddleware(m));

    this.app.post(path, ...adaptedMiddlewares, (req: Request, res: Response) =>
      handler(req, res)
    );
  }

  patch(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void,
    ...middlewares: HttpMiddleware[]
  ): void {
    const adaptedMiddlewares = middlewares.map(m => this.adaptMiddleware(m));

    this.app.patch(path, ...adaptedMiddlewares, (req: Request, res: Response) =>
      handler(req, res)
    );
  }

  delete(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void,
    ...middlewares: HttpMiddleware[]
  ): void {
    const adaptedMiddlewares = middlewares.map(m => this.adaptMiddleware(m));

    this.app.delete(
      path,
      ...adaptedMiddlewares,
      (req: Request, res: Response) => handler(req, res)
    );
  }

  getExpressInstance() {
    return this.app;
  }

  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }
}
