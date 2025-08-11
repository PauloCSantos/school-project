import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
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
    const policiesService = new PoliciesService();

    // Create all required use cases
    const createAttendance = new CreateAttendance(repository, policiesService);
    const deleteAttendance = new DeleteAttendance(repository, policiesService);
    const findAllAttendance = new FindAllAttendance(
      repository,
      policiesService
    );
    const findAttendance = new FindAttendance(repository, policiesService);
    const updateAttendance = new UpdateAttendance(repository, policiesService);
    const addStudents = new AddStudents(repository, policiesService);
    const removeStudents = new RemoveStudents(repository, policiesService);

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
