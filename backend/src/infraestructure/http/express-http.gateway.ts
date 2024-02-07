import HttpGateway from '@/application/gateway/http.gateway';
import express, { Request, Response } from 'express';

export default class ExpressHttpGateway
  implements HttpGateway<Request, Response>
{
  private readonly app: express.Application;

  constructor() {
    this.app = express();
  }
  get(path: string, handler: (req: Request, res: Response) => void): void {
    this.app.get(path, handler);
  }
  post(path: string, handler: (req: Request, res: Response) => void): void {
    this.app.post(path, handler);
  }
  put(path: string, handler: (req: Request, res: Response) => void): void {
    this.app.put(path, handler);
  }
  patch(path: string, handler: (req: Request, res: Response) => void): void {
    this.app.patch(path, handler);
  }
  delete(path: string, handler: (req: Request, res: Response) => void): void {
    this.app.delete(path, handler);
  }
  listen(port: number): void {
    this.app.listen(port);
  }
}
