import { Provider } from '@angular/core';
import { USER_ROLE_REGISTRY } from '../tokens/users.tokens';
import { AdministratorProfileService } from '../services/administrator-profile.service';

export function provideAdministratorUsers(): Provider[] {
  return [
    AdministratorProfileService,
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      useFactory: (svc: AdministratorProfileService) => ({
        role: 'administrator' as const,
        service: svc,
      }),
      deps: [AdministratorProfileService],
    },
  ];
}
