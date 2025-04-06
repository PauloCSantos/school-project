import MemoryAttendanceRepository from '../../infrastructure/repositories/memory-repository/attendance.repository';
import AttendanceFacade from '../facade/facade/attendance.facade';
import AddStudents from '../usecases/attendance/addStudents.usecase';
import CreateAttendance from '../usecases/attendance/createAttendance.usecase';
import DeleteAttendance from '../usecases/attendance/deleteAttendance.usecase';
import FindAllAttendance from '../usecases/attendance/findAllAttendance.usecase';
import FindAttendance from '../usecases/attendance/findAttendance.usecase';
import RemoveStudents from '../usecases/attendance/removeStudents.usecase';
import UpdateAttendance from '../usecases/attendance/updateAttendance.usecase';

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
