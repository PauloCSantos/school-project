import { Provider } from '@angular/core';
import { USER_ROLE_REGISTRY } from '../tokens/users.tokens';
import { StudentProfileService } from '../services/student-profile.service';

export function provideStudentUsers(): Provider[] {
  return [
    StudentProfileService,
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      useFactory: (svc: StudentProfileService) => ({ role: 'student' as const, service: svc }),
      deps: [StudentProfileService],
    },
  ];
}
