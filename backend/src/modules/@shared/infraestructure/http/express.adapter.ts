import express, { Application, Request, Response } from 'express';
import {
  HttpServer,
  HttpRequest,
  HttpResponseData,
  HttpMiddleware,
} from './http.interface';

/**
 * Adapter that encapsulates Express and implements HttpServer.
 */
export class ExpressAdapter implements HttpServer {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  get(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void {
    this.app.get(path, this.handleRequest(handler, middlewares));
  }

  post(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void {
    this.app.post(path, this.handleRequest(handler, middlewares));
  }

  patch(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void {
    this.app.patch(path, this.handleRequest(handler, middlewares));
  }

  delete(
    path: string,
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    ...middlewares: HttpMiddleware<any, any, any, any>[]
  ): void {
    this.app.delete(path, this.handleRequest(handler, middlewares));
  }

  private handleRequest(
    handler: (
      req: HttpRequest<any, any, any, any>
    ) => Promise<HttpResponseData>,
    middlewares: HttpMiddleware<any, any, any, any>[]
  ) {
    return (req: Request, res: Response): void => {
      const httpReq: HttpRequest = {
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers,
      };
      let idx = -1;

      const runner = async (): Promise<HttpResponseData> => {
        idx++;
        if (idx < middlewares.length) {
          return middlewares[idx].handle(httpReq, runner);
        }
        return handler(httpReq);
      };

      runner()
        .then(response => {
          res.status(response.statusCode).json(response.body);
        })
        .catch(() => {
          res.status(500).json({ message: 'Internal server error' });
        });
    };
  }

  /**
   * Available for use in tests with Supertest.
   */
  public getNativeServer(): Application {
    return this.app;
  }

  /**
   * Starts the server on the specified port.
   */
  public listen(port: number, cb?: () => void): void {
    this.app.listen(port, cb);
  }
}
