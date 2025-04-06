import express, { Request, Response } from 'express';
import { HttpInterface, HttpRequest, HttpResponse } from './http.interface';

export default class ExpressHttp implements HttpInterface {
  private app = express();

  constructor() {
    this.app.use(express.json());
  }

  get(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void {
    this.app.get(path, (req: Request, res: Response) => handler(req, res));
  }

  post(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void {
    this.app.post(path, (req: Request, res: Response) => handler(req, res));
  }

  patch(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void {
    this.app.patch(path, (req: Request, res: Response) => handler(req, res));
  }

  delete(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void {
    this.app.delete(path, (req: Request, res: Response) => handler(req, res));
  }

  getExpressInstance() {
    return this.app;
  }

  listen(port: number, callback?: () => void): void {
    this.app.listen(port, callback);
  }
}
