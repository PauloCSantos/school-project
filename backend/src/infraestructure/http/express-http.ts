import { HttpInterface } from './http.interface';
import express from 'express';
export default class ExpressHttp implements HttpInterface {
  constructor(private readonly expressInstance = express()) {
    this.expressInstance.use(express.json());
    this.expressInstance.use(express.urlencoded({ extended: true }));
  }

  get(path: string, handler: any): void {
    this.expressInstance.get(path, (req, res) => {
      handler(req, res);
    });
  }
  post(path: string, handler: any): void {
    this.expressInstance.post(path, (req, res) => {
      handler(req, res);
    });
  }
  put(path: string, handler: any): void {
    this.expressInstance.put(path, (req, res) => {
      handler(req, res);
    });
  }
  patch(path: string, handler: any): void {
    this.expressInstance.patch(path, (req, res) => {
      handler(req, res);
    });
  }
  delete(path: string, handler: any): void {
    this.expressInstance.delete(path, (req, res) => {
      handler(req, res);
    });
  }
  listen(port: number): void {
    this.expressInstance.listen(port, () => {
      console.log(`Listen on ${port}`);
    });
  }
  getExpressInstance() {
    return this.expressInstance;
  }
}
