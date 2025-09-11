import { Provider } from '@angular/core';
import { AdministratorProfileService } from '../services/administrator-profile.service';
import { ADMIN_PROFILE_SERVICE_TOKEN } from '../tokens/user-service-token';

export function provideAdministratorUsers(): Provider[] {
  return [
    AdministratorProfileService,
    { provide: ADMIN_PROFILE_SERVICE_TOKEN, useExisting: AdministratorProfileService },
  ];
}
