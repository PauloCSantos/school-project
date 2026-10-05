import { Provider } from '@angular/core';
import { StudentProfileService } from '../services/student-profile.service';
import { STUDENT_PROFILE_SERVICE } from '../../feature/wizard/core/tokens';

export function provideStudentUsers(): Provider[] {
  return [
    StudentProfileService,
    { provide: STUDENT_PROFILE_SERVICE, useExisting: StudentProfileService },
  ];
}
