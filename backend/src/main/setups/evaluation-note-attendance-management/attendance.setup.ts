import AddStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/addStudents.usecase';
import CreateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/createAttendance.usecase';
import DeleteAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/deleteAttendance.usecase';
import FindAllAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAllAttendance.usecase';
import FindAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAttendance.usecase';
import RemoveStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/removeStudents.usecase';
import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryAttendanceRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/attendance.repository';
import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import { AttendanceRoute } from '@/interface/route/evaluation-note-attendance-management/attendance.route';

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

  const attendanceRoute = new AttendanceRoute(attendanceController, express);
  attendanceRoute.routes();
}
