import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/** Use este contexto para pular o header Authorization e o tratamento 401 quando necessário */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

function withAuthHeader(req: HttpRequest<any>, token: string) {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1) Anexa Authorization se houver token e se não estiver marcado para pular
  if (!req.context.get(SKIP_AUTH)) {
    const token = auth.getToken();
    if (token) {
      req = withAuthHeader(req, token);
    }
  }

  // 2) Tratamento global de 401
  return next(req).pipe(
    catchError((err: unknown) => {
      if (
        !req.context.get(SKIP_AUTH) && // não trate 401 em chamadas públicas
        err instanceof HttpErrorResponse &&
        err.status === 401
      ) {
        auth.logout(); // limpa token + dados
        // evite loop: só navegue se não estiver já na tela de login
        if (!router.url.startsWith('/login')) {
          router.navigate(['/login'], { replaceUrl: true });
        }
      }
      // repropaga para que outros interceptors (ex.: apiError) façam o trabalho deles
      return throwError(() => err);
    })
  );
};
