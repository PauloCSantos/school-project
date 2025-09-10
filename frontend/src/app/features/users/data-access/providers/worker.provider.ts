import { Provider } from '@angular/core';
import { USER_ROLE_REGISTRY } from '../tokens/users.tokens';
import { WorkerProfileService } from '../services/worker-profile.service';

export function provideWorkerUsers(): Provider[] {
  return [
    WorkerProfileService,
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      useFactory: (svc: WorkerProfileService) => ({ role: 'worker' as const, service: svc }),
      deps: [WorkerProfileService],
    },
  ];
}
