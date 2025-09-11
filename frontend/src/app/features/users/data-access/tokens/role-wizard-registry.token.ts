import { InjectionToken, Provider } from '@angular/core';
import { RoleWizardConfig } from '../../config/roles';

export const ROLE_WIZARD_REGISTRY = new InjectionToken<RoleWizardConfig[]>('ROLE_WIZARD_REGISTRY');

export function provideRole(config: RoleWizardConfig): Provider {
  return { provide: ROLE_WIZARD_REGISTRY, multi: true, useValue: config };
}
