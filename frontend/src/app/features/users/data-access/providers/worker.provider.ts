import { Provider } from '@angular/core';
import { WorkerProfileService } from '../services/worker-profile.service';
import { WORKER_PROFILE_SERVICE_TOKEN } from '../tokens/user-service-token';

export function provideWorkerUsers(): Provider[] {
  return [
    WorkerProfileService,
    { provide: WORKER_PROFILE_SERVICE_TOKEN, useExisting: WorkerProfileService },
  ];
}
