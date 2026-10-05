import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withNoXsrfProtection } from '@angular/common/http';
import { routes } from './app.routes';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';
import { API_BASE_URL } from './core/tokens/api-base-url.token';
import { environment } from '../environments/environment';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, apiErrorInterceptor, authInterceptor]),
      withNoXsrfProtection()
    ),
    { provide: API_BASE_URL, useValue: environment.baseUrl },
  ],
};
