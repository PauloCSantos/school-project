import { config, isProd } from '@/main/config/env';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import initializeUserMaster from './setups/user-management/user-master.setup';
import initializeUserAdministrator from './setups/user-management/user-administrator.setup';
import initializeUserStudent from './setups/user-management/user-student.setup';
import initializeUserTeacher from './setups/user-management/user-teacher.setup';
import initializeUserWorker from './setups/user-management/user-worker.setup';
import initializeSubject from './setups/subject-curriculum-management/subject.setup';
import initializeCurriculum from './setups/subject-curriculum-management/curriculum.setup';
import initializeSchedule from './setups/schedule-lesson-management/schedule.setup';
import initializeLesson from './setups/schedule-lesson-management/lesson.setup';
import initializeEvent from './setups/event-calendar-management/event.setup';
import initializeEvaluation from './setups/evaluation-note-attendance-management/evaluation.setup';
import initializeNote from './setups/evaluation-note-attendance-management/note.setup';
import initializeAttendance from './setups/evaluation-note-attendance-management/attendance.setup';
import initializeAuthUser from './setups/authentication-authorization-management/auth-user.setup';
import tokenInstance from './config/token-service.instance';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryUserRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user.repository';
import { UserService } from '@/modules/user-management/domain/services/user.service';

async function startServer() {
  const appCfg = config;
  const expressHttp = new ExpressAdapter();
  const tokenService = tokenInstance(appCfg.jwt.secret);

  const authUserService = new AuthUserService();
  const policiesService = new PoliciesService();
  const userRepository = new MemoryUserRepository();

  const userService = new UserService(userRepository);

  initializeUserMaster(
    expressHttp,
    tokenService,
    authUserService,
    policiesService,
    userService,
    isProd
  );
  initializeUserAdministrator(
    expressHttp,
    tokenService,
    authUserService,
    policiesService,
    userService,
    isProd
  );
  initializeUserStudent(
    expressHttp,
    tokenService,
    authUserService,
    policiesService,
    userService,
    isProd
  );
  initializeUserTeacher(
    expressHttp,
    tokenService,
    authUserService,
    policiesService,
    userService,
    isProd
  );
  initializeUserWorker(
    expressHttp,
    tokenService,
    authUserService,
    policiesService,
    userService,
    isProd
  );
  initializeSubject(expressHttp, tokenService, policiesService, isProd);
  initializeCurriculum(expressHttp, tokenService, policiesService, isProd);
  initializeSchedule(expressHttp, tokenService, policiesService, isProd);
  initializeLesson(expressHttp, tokenService, policiesService, isProd);
  initializeEvent(expressHttp, tokenService, policiesService, isProd);
  initializeEvaluation(expressHttp, tokenService, policiesService, isProd);
  initializeNote(expressHttp, tokenService, policiesService, isProd);
  initializeAttendance(expressHttp, tokenService, policiesService, isProd);
  initializeAuthUser(expressHttp, tokenService, authUserService, policiesService, isProd);

  expressHttp.listen(appCfg.port);
}

startServer().catch(err => {
  console.error('Fatal error: ', err);
  process.exit(1);
});
