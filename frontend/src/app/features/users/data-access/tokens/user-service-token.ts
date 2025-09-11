import { InjectionToken } from '@angular/core';
import { IUserProfileService } from '../../config/roles';

// Cada token representa o adapter da role para o wizard
export const ADMIN_PROFILE_SERVICE_TOKEN = new InjectionToken<IUserProfileService<any>>(
  'ADMIN_PROFILE_SERVICE_TOKEN'
);
export const TEACHER_PROFILE_SERVICE_TOKEN = new InjectionToken<IUserProfileService<any>>(
  'TEACHER_PROFILE_SERVICE_TOKEN'
);
export const STUDENT_PROFILE_SERVICE_TOKEN = new InjectionToken<IUserProfileService<any>>(
  'STUDENT_PROFILE_SERVICE_TOKEN'
);
export const WORKER_PROFILE_SERVICE_TOKEN = new InjectionToken<IUserProfileService<any>>(
  'WORKER_PROFILE_SERVICE_TOKEN'
);
export const MASTER_PROFILE_SERVICE_TOKEN = new InjectionToken<IUserProfileService<any>>(
  'MASTER_PROFILE_SERVICE_TOKEN'
);
