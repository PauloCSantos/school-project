import { Provider } from '@angular/core';
import { WorkerProfileService } from '../services/worker-profile.service';
import { WORKER_PROFILE_SERVICE } from '../../feature/wizard/core/tokens';

export function provideWorkerUsers(): Provider[] {
  return [
    WorkerProfileService,
    { provide: WORKER_PROFILE_SERVICE, useExisting: WorkerProfileService },
  ];
}
