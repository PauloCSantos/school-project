import { Provider } from '@angular/core';
import { MasterProfileService } from '../services/master-profile.service';
import { MASTER_PROFILE_SERVICE } from '../../feature/wizard/core/tokens';

export function provideMasterUsers(): Provider[] {
  return [
    MasterProfileService,
    { provide: MASTER_PROFILE_SERVICE, useExisting: MasterProfileService },
  ];
}
