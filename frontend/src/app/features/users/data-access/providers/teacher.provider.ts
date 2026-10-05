import { Provider } from '@angular/core';
import { TeacherProfileService } from '../services/teacher-profile.service';
import { TEACHER_PROFILE_SERVICE } from '../../feature/wizard/core/tokens';

export function provideTeacherUsers(): Provider[] {
  return [
    TeacherProfileService,
    { provide: TEACHER_PROFILE_SERVICE, useExisting: TeacherProfileService },
  ];
}
