import { Provider } from '@angular/core';
import { AdministratorProfileService } from '../services/administrator-profile.service';
import { ADMIN_PROFILE_SERVICE } from '../../feature/wizard/core/tokens';

export function provideAdministratorUsers(): Provider[] {
  return [
    AdministratorProfileService,
    { provide: ADMIN_PROFILE_SERVICE, useExisting: AdministratorProfileService },
  ];
}
