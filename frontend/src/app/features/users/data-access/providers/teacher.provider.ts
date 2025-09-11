import { Provider } from '@angular/core';
import { TeacherProfileService } from '../services/teacher-profile.service';
import { TEACHER_PROFILE_SERVICE_TOKEN } from '../tokens/user-service-token';

export function provideTeacherUsers(): Provider[] {
  return [
    TeacherProfileService,
    { provide: TEACHER_PROFILE_SERVICE_TOKEN, useExisting: TeacherProfileService },
  ];
}
