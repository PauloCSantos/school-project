import AttendanceFacade from '@/application/facade/evaluation-note-attendance-management/facade/attendance.facade';
import AddStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/addStudents.usecase';
import CreateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/createAttendance.usecase';
import DeleteAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/deleteAttendance.usecase';
import FindAllAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAllAttendance.usecase';
import FindAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAttendance.usecase';
import RemoveStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/removeStudents.usecase';
import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import MemoryAttendanceRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/attendance.repository';

export default class AttendanceFacadeFactory {
  static create(): AttendanceFacade {
    const repository = new MemoryAttendanceRepository();
    const createAttendance = new CreateAttendance(repository);
    const deleteAttendance = new DeleteAttendance(repository);
    const findAllAttendance = new FindAllAttendance(repository);
    const findAttendance = new FindAttendance(repository);
    const updateAttendance = new UpdateAttendance(repository);
    const addStudents = new AddStudents(repository);
    const removeStudents = new RemoveStudents(repository);
    const facade = new AttendanceFacade({
      createAttendance,
      deleteAttendance,
      findAllAttendance,
      findAttendance,
      updateAttendance,
      addStudents,
      removeStudents,
    });

    return facade;
  }
}
