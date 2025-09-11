import { Provider } from '@angular/core';
import { StudentProfileService } from '../services/student-profile.service';
import { STUDENT_PROFILE_SERVICE_TOKEN } from '../tokens/user-service-token';

export function provideStudentUsers(): Provider[] {
  return [
    StudentProfileService,
    { provide: STUDENT_PROFILE_SERVICE_TOKEN, useExisting: StudentProfileService },
  ];
}
