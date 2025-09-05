import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '../tokens/api-base-url.token';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);

  if (/^https?:\/\//i.test(req.url)) return next(req);

  return next(req.clone({ url: `${baseUrl}${req.url}` }));
};
