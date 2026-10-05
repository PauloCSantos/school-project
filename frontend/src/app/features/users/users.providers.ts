import { Provider } from '@angular/core';
import { USER_ROLE_REGISTRY } from './data-access/tokens/users.tokens';
import { provideRoleWizardRegistry } from './feature/wizard/core/role-wizard-registry.config';
import {
  provideAdministratorUsers,
  provideTeacherUsers,
  provideStudentUsers,
  provideWorkerUsers,
  provideMasterUsers,
} from './data-access/providers';
import { AdministratorUsersAdapter } from './data-access/adapters/administrator.adapter';
import { TeacherUsersAdapter } from './data-access/adapters/teacher.adapter';
import { StudentUsersAdapter } from './data-access/adapters/student.adapter';
import { WorkerUsersAdapter } from './data-access/adapters/worker.adapter';

import { UsersFacade } from './data-access/facades/users.facade';

export function provideUsersFeature(): Provider[] {
  return [
    provideRoleWizardRegistry(),
    ...provideAdministratorUsers(),
    ...provideTeacherUsers(),
    ...provideStudentUsers(),
    ...provideWorkerUsers(),
    ...provideMasterUsers(),

    AdministratorUsersAdapter,
    TeacherUsersAdapter,
    StudentUsersAdapter,
    WorkerUsersAdapter,

    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [AdministratorUsersAdapter],
      useFactory: (svc: AdministratorUsersAdapter) => ({ role: 'administrator', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [TeacherUsersAdapter],
      useFactory: (svc: TeacherUsersAdapter) => ({ role: 'teacher', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [StudentUsersAdapter],
      useFactory: (svc: StudentUsersAdapter) => ({ role: 'student', service: svc }),
    },
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      deps: [WorkerUsersAdapter],
      useFactory: (svc: WorkerUsersAdapter) => ({ role: 'worker', service: svc }),
    },

    UsersFacade,
  ];
}
