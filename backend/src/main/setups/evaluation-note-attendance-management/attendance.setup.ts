import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryAttendanceRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/attendance.repository';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/createAttendance.usecase';
import FindAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/findAttendance.usecase';
import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/findAllAttendance.usecase';
import UpdateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/updateAttendance.usecase';
import DeleteAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/deleteAttendance.usecase';
import AddStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/addStudents.usecase';
import RemoveStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/removeStudents.usecase';
import { AttendanceController } from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import { AttendanceRoute } from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';

export default function initializeAttendance(express: ExpressHttp): void {
  const attendanceRepository = new MemoryAttendanceRepository();
  const createAttendanceUsecase = new CreateAttendance(attendanceRepository);
  const findAttendanceUsecase = new FindAttendance(attendanceRepository);
  const findAllAttendanceUsecase = new FindAllAttendance(attendanceRepository);
  const updateAttendanceUsecase = new UpdateAttendance(attendanceRepository);
  const deleteAttendanceUsecase = new DeleteAttendance(attendanceRepository);
  const addStudentsAttendance = new AddStudents(attendanceRepository);
  const removeStudentsAttendance = new RemoveStudents(attendanceRepository);
  const attendanceController = new AttendanceController(
    createAttendanceUsecase,
    findAttendanceUsecase,
    findAllAttendanceUsecase,
    updateAttendanceUsecase,
    deleteAttendanceUsecase,
    addStudentsAttendance,
    removeStudentsAttendance
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const attendanceRoute = new AttendanceRoute(
    attendanceController,
    express,
    authUserMiddleware
  );
  attendanceRoute.routes();
}
