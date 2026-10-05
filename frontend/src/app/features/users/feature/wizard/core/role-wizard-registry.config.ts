import { Provider } from '@angular/core';
import { ROLE_WIZARD_REGISTRY, RoleWizardRegistry } from './tokens';

import {
  ADMIN_CONFIG,
  TEACHER_CONFIG,
  STUDENT_CONFIG,
  WORKER_CONFIG,
  MASTER_CONFIG,
} from '../user-role.config';

export const ROLE_WIZARD_REGISTRY_VALUE: RoleWizardRegistry = {
  administrator: ADMIN_CONFIG,
  teacher: TEACHER_CONFIG,
  student: STUDENT_CONFIG,
  worker: WORKER_CONFIG,
  master: MASTER_CONFIG,
};

export function provideRoleWizardRegistry(): Provider {
  return {
    provide: ROLE_WIZARD_REGISTRY,
    useValue: ROLE_WIZARD_REGISTRY_VALUE,
  };
}
