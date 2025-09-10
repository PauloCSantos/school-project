import { Provider } from '@angular/core';
import { USER_ROLE_REGISTRY } from '../tokens/users.tokens';
import { TeacherProfileService } from '../services/teacher-profile.service';

export function provideTeacherUsers(): Provider[] {
  return [
    TeacherProfileService,
    {
      provide: USER_ROLE_REGISTRY,
      multi: true,
      useFactory: (svc: TeacherProfileService) => ({ role: 'teacher' as const, service: svc }),
      deps: [TeacherProfileService],
    },
  ];
}
