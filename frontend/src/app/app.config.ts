// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';
import { API_BASE_URL } from './core/tokens/api-base-url.token';
import { environment } from '../environments/environment';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideRoleWizardConfigs } from './features/users/config/user-role.config';

// 👉 imports necessários para o registry:
import { USER_ROLE_REGISTRY } from './features/users/data-access/tokens/users.tokens';
import { AdministratorProfileService } from './features/users/data-access/services/administrator-profile.service';
import { TeacherProfileService } from './features/users/data-access/services/teacher-profile.service';
import { StudentProfileService } from './features/users/data-access/services/student-profile.service';
import { WorkerProfileService } from './features/users/data-access/services/worker-profile.service';
import {
  provideAdministratorUsers,
  provideMasterUsers,
  provideStudentUsers,
  provideTeacherUsers,
  provideWorkerUsers,
} from './features/users/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideRoleWizardConfigs(),
    ...provideMasterUsers(),
    ...provideAdministratorUsers(),
    ...provideTeacherUsers(),
    ...provideStudentUsers(),
    ...provideWorkerUsers(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([baseUrlInterceptor, apiErrorInterceptor, authInterceptor])),
    { provide: API_BASE_URL, useValue: environment.baseUrl },

    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [AdministratorProfileService],
      useFactory: (svc: AdministratorProfileService) => ({ role: 'administrator', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [TeacherProfileService],
      useFactory: (svc: TeacherProfileService) => ({ role: 'teacher', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [StudentProfileService],
      useFactory: (svc: StudentProfileService) => ({ role: 'student', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [WorkerProfileService],
      useFactory: (svc: WorkerProfileService) => ({ role: 'worker', service: svc }),
    },
  ],
};
