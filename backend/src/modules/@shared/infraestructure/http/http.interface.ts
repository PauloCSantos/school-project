export interface HttpRequest {
  params?: any;
  query?: any;
  body?: any;
  headers?: any;
  [key: string]: any;
}

export interface HttpResponse {
  status(code: number): this;
  json(data: any): void;
}

export interface HttpInterface {
  get(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void;
  post(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void;
  patch(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void;
  delete(
    path: string,
    handler: (req: HttpRequest, res: HttpResponse) => void
  ): void;
}
