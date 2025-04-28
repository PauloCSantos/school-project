import MemoryAttendanceRepository from '../../infrastructure/repositories/memory-repository/attendance.repository';
import AttendanceFacade from '../facade/facade/attendance.facade';
import AddStudents from '../usecases/attendance/add-students.usecase';
import CreateAttendance from '../usecases/attendance/create.usecase';
import DeleteAttendance from '../usecases/attendance/delete.usecase';
import FindAllAttendance from '../usecases/attendance/find-all.usecase';
import FindAttendance from '../usecases/attendance/find.usecase';
import RemoveStudents from '../usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../usecases/attendance/update.usecase';

/**
 * Factory responsible for creating AttendanceFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class AttendanceFacadeFactory {
  /**
   * Creates an instance of AttendanceFacade with all dependencies properly configured
   * @returns Fully configured AttendanceFacade instance
   */
  static create(): AttendanceFacade {
    // Currently using memory repository only
    // Future implementation will use environment variables to determine repository type
    const repository = new MemoryAttendanceRepository();

    // Create all required use cases
    const createAttendance = new CreateAttendance(repository);
    const deleteAttendance = new DeleteAttendance(repository);
    const findAllAttendance = new FindAllAttendance(repository);
    const findAttendance = new FindAttendance(repository);
    const updateAttendance = new UpdateAttendance(repository);
    const addStudents = new AddStudents(repository);
    const removeStudents = new RemoveStudents(repository);

    // Instantiate and return the facade with all required use cases
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
