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
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';
import MasterFacadeFactory from '@/modules/user-management/application/factory/master-facade.factory';
import AdministratorFacadeFactory from '@/modules/user-management/application/factory/administrator-facade.factory';
import TeacherFacadeFactory from '@/modules/user-management/application/factory/teacher-facade.factory';
import StudentFacadeFactory from '@/modules/user-management/application/factory/student-facade.factory';
import WorkerFacadeFactory from '@/modules/user-management/application/factory/worker-facade.factory';
import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';

async function startServer() {
  const appCfg = config;
  const expressHttp = new ExpressAdapter();
  const tokenService = tokenInstance(appCfg.jwt.secret);

  const authUserService = new AuthUserService();
  const policiesService = new PoliciesService();
  const userRepository = new MemoryUserRepository();

  const userService = new UserService(userRepository);
  const authUserRepository = new MemoryAuthUserRepository(authUserService);
  const emailValidatorService = new EmailAuthValidatorService(authUserRepository);

  const userMasterRepository = new MemoryUserMasterRepository();
  const userAdministratorRepository = new MemoryUserAdministratorRepository();
  const userTeacherRepository = new MemoryUserTeacherRepository();
  const userStudentRepository = new MemoryUserStudentRepository();
  const userWorkerRepository = new MemoryUserWorkerRepository();

  const tenantRepository = new MemoryTenantRepository();
  const tenantService = new TenantService(tenantRepository);

  const masterFacade = MasterFacadeFactory.create(
    userMasterRepository,
    emailValidatorService,
    policiesService,
    userService,
    tenantService
  );
  const administratorFacade = AdministratorFacadeFactory.create(
    userAdministratorRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const teacherFacade = TeacherFacadeFactory.create(
    userTeacherRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const studentFacade = StudentFacadeFactory.create(
    userStudentRepository,
    emailValidatorService,
    policiesService,
    userService
  );
  const workerFacade = WorkerFacadeFactory.create(
    userWorkerRepository,
    emailValidatorService,
    policiesService,
    userService
  );

  initializeUserMaster(
    expressHttp,
    tokenService,
    userMasterRepository,
    emailValidatorService,
    policiesService,
    userService,
    tenantService,
    isProd
  );
  initializeUserAdministrator(
    expressHttp,
    tokenService,
    userAdministratorRepository,
    emailValidatorService,
    policiesService,
    userService,
    isProd
  );
  initializeUserStudent(
    expressHttp,
    tokenService,
    userStudentRepository,
    emailValidatorService,
    policiesService,
    userService,
    isProd
  );
  initializeUserTeacher(
    expressHttp,
    tokenService,
    userTeacherRepository,
    emailValidatorService,
    policiesService,
    userService,
    isProd
  );
  initializeUserWorker(
    expressHttp,
    tokenService,
    userWorkerRepository,
    emailValidatorService,
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
  initializeAuthUser(
    expressHttp,
    tokenService,
    tenantRepository,
    tenantService,
    authUserService,
    policiesService,
    authUserRepository,
    masterFacade,
    administratorFacade,
    teacherFacade,
    studentFacade,
    workerFacade,
    isProd
  );

  expressHttp.listen(appCfg.port);
}

startServer().catch(err => {
  console.error('Fatal error: ', err);
  process.exit(1);
});
