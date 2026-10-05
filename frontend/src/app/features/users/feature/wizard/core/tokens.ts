import { InjectionToken } from '@angular/core';
import { IUserProfileService, RoleWizardConfig } from './types';

import { AdministratorProfileRequest } from '../../../data-access/dto/administrator/administrator.request';
import { TeacherProfileRequest } from '../../../data-access/dto/teacher/teacher.request';
import { StudentProfileRequest } from '../../../data-access/dto/student/student.request';
import { WorkerProfileRequest } from '../../../data-access/dto/worker/worker.request';
import { MasterProfileRequest } from '../../../data-access/dto/master/master.request';

export const ADMIN_PROFILE_SERVICE = new InjectionToken<
  IUserProfileService<AdministratorProfileRequest>
>('ADMIN_PROFILE_SERVICE');

export const TEACHER_PROFILE_SERVICE = new InjectionToken<
  IUserProfileService<TeacherProfileRequest>
>('TEACHER_PROFILE_SERVICE');

export const STUDENT_PROFILE_SERVICE = new InjectionToken<
  IUserProfileService<StudentProfileRequest>
>('STUDENT_PROFILE_SERVICE');

export const WORKER_PROFILE_SERVICE = new InjectionToken<IUserProfileService<WorkerProfileRequest>>(
  'WORKER_PROFILE_SERVICE'
);

export const MASTER_PROFILE_SERVICE = new InjectionToken<IUserProfileService<MasterProfileRequest>>(
  'MASTER_PROFILE_SERVICE'
);

export type RoleWizardRegistry = {
  administrator: RoleWizardConfig<any, AdministratorProfileRequest>;
  teacher: RoleWizardConfig<any, TeacherProfileRequest>;
  student: RoleWizardConfig<any, StudentProfileRequest>;
  worker: RoleWizardConfig<any, WorkerProfileRequest>;
  master: RoleWizardConfig<any, MasterProfileRequest>;
};

export const ROLE_WIZARD_REGISTRY = new InjectionToken<RoleWizardRegistry>('ROLE_WIZARD_REGISTRY');
