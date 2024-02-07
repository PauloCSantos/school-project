import StudentFacade from '@/application/facade/user-management/facade/student.facade';
import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import DeleteUserStudent from '@/application/usecases/user-management/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import FindUserStudent from '@/application/usecases/user-management/student/findUserStudent.usecase';
import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import MemoryUserStudentRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-student.repository';

export default class StudentFacadeFactory {
  static create(): StudentFacade {
    const repository = new MemoryUserStudentRepository();
    const createUserStudent = new CreateUserStudent(repository);
    const deleteUserStudent = new DeleteUserStudent(repository);
    const findAllUserStudent = new FindAllUserStudent(repository);
    const findUserStudent = new FindUserStudent(repository);
    const updateUserStudent = new UpdateUserStudent(repository);
    const facade = new StudentFacade({
      createUserStudent,
      deleteUserStudent,
      findAllUserStudent,
      findUserStudent,
      updateUserStudent,
    });

    return facade;
  }
}
