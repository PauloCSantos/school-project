import { Provider } from '@angular/core';
import { MasterProfileService } from '../services/master-profile.service';
import { MASTER_PROFILE_SERVICE_TOKEN } from '../tokens/user-service-token';

export function provideMasterUsers(): Provider[] {
  return [
    MasterProfileService,
    { provide: MASTER_PROFILE_SERVICE_TOKEN, useExisting: MasterProfileService },
  ];
}
