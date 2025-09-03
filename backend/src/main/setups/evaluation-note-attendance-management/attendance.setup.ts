import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryAttendanceRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/attendance.repository';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/create.usecase';
import FindAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find.usecase';
import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find-all.usecase';
import UpdateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/update.usecase';
import DeleteAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/delete.usecase';
import AddStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/add-students.usecase';
import RemoveStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/remove-students.usecase';
import AttendanceController from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import AttendanceRoute from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeAttendance(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const attendanceRepository = new MemoryAttendanceRepository();

  const createAttendanceUsecase = new CreateAttendance(
    attendanceRepository,
    policiesService
  );
  const findAttendanceUsecase = new FindAttendance(attendanceRepository, policiesService);
  const findAllAttendanceUsecase = new FindAllAttendance(
    attendanceRepository,
    policiesService
  );
  const updateAttendanceUsecase = new UpdateAttendance(
    attendanceRepository,
    policiesService
  );
  const deleteAttendanceUsecase = new DeleteAttendance(
    attendanceRepository,
    policiesService
  );
  const addStudentsAttendance = new AddStudents(attendanceRepository, policiesService);
  const removeStudentsAttendance = new RemoveStudents(
    attendanceRepository,
    policiesService
  );

  const attendanceController = new AttendanceController(
    createAttendanceUsecase,
    findAttendanceUsecase,
    findAllAttendanceUsecase,
    updateAttendanceUsecase,
    deleteAttendanceUsecase,
    addStudentsAttendance,
    removeStudentsAttendance
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];

  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const attendanceRoute = new AttendanceRoute(
    attendanceController,
    express,
    authUserMiddleware
  );
  attendanceRoute.routes();
}
