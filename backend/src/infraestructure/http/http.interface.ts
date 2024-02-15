export interface HttpInterface {
  get<Req, Res>(path: string, handler: (req: Req, res: Res) => void): void;
  post<Req, Res>(path: string, handler: (req: Req, res: Res) => void): void;
  put<Req, Res>(path: string, handler: (req: Req, res: Res) => void): void;
  patch<Req, Res>(path: string, handler: (req: Req, res: Res) => void): void;
  delete<Req, Res>(path: string, handler: (req: Req, res: Res) => void): void;
  listen(port: number): void;
}
