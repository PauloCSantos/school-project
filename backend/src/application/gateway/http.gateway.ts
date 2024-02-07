export default interface HttpGateway<Request, Response> {
  get(path: string, handler: (req: Request, res: Response) => void): void;
  post(path: string, handler: (req: Request, res: Response) => void): void;
  put(path: string, handler: (req: Request, res: Response) => void): void;
  patch(path: string, handler: (req: Request, res: Response) => void): void;
  delete(path: string, handler: (req: Request, res: Response) => void): void;
  listen(port: number): void;
}
