import CheckRegistration from '@/modules/authentication-authorization-management/application/usecases/authUser/check-registration.usecase';
import AdministratorFacadeInterface from '@/modules/user-management/application/facade/interface/administrator-facade.interface';
import MasterFacadeInterface from '@/modules/user-management/application/facade/interface/master-facade.interface';
import StudentFacadeInterface from '@/modules/user-management/application/facade/interface/student-facade.interface';
import TeacherFacadeInterface from '@/modules/user-management/application/facade/interface/teacher-facade.interface';
import WorkerFacadeInterface from '@/modules/user-management/application/facade/interface/worker-facade.interface';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { InternalError } from '@/modules/@shared/application/errors/internal.error';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

jest.mock('@/modules/@shared/utils/formatting', () => ({
  toRoleType: jest.fn(),
}));
import { toRoleType } from '@/modules/@shared/utils/formatting';

describe('CheckRegistration Use Case', () => {
  let masterFacade: jest.Mocked<MasterFacadeInterface>;
  let adminFacade: jest.Mocked<AdministratorFacadeInterface>;
  let teacherFacade: jest.Mocked<TeacherFacadeInterface>;
  let studentFacade: jest.Mocked<StudentFacadeInterface>;
  let workerFacade: jest.Mocked<WorkerFacadeInterface>;
  let usecase: CheckRegistration;

  const makeDefaultToken = (role: RoleUsersEnum = RoleUsersEnum.MASTER): TokenData =>
    ({
      id: 'user-id-123',
      email: 'user@test.com',
      role,
    }) as unknown as TokenData;

  const MockMasterFacade = (): jest.Mocked<MasterFacadeInterface> =>
    ({
      checkUserMasterFromToken: jest.fn(),
    }) as unknown as jest.Mocked<MasterFacadeInterface>;

  const MockAdminFacade = (): jest.Mocked<AdministratorFacadeInterface> =>
    ({
      checkUserAdministratorFromToken: jest.fn(),
    }) as unknown as jest.Mocked<AdministratorFacadeInterface>;

  const MockTeacherFacade = (): jest.Mocked<TeacherFacadeInterface> =>
    ({
      checkUserTeacherFromToken: jest.fn(),
    }) as unknown as jest.Mocked<TeacherFacadeInterface>;

  const MockStudentFacade = (): jest.Mocked<StudentFacadeInterface> =>
    ({
      checkUserStudentFromToken: jest.fn(),
    }) as unknown as jest.Mocked<StudentFacadeInterface>;

  const MockWorkerFacade = (): jest.Mocked<WorkerFacadeInterface> =>
    ({
      checkUserWorkerFromToken: jest.fn(),
    }) as unknown as jest.Mocked<WorkerFacadeInterface>;

  beforeEach(() => {
    masterFacade = MockMasterFacade();
    adminFacade = MockAdminFacade();
    teacherFacade = MockTeacherFacade();
    studentFacade = MockStudentFacade();
    workerFacade = MockWorkerFacade();
    usecase = new CheckRegistration(
      masterFacade,
      adminFacade,
      teacherFacade,
      studentFacade,
      workerFacade
    );

    (toRoleType as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call master facade and return boolean for MASTER role', async () => {
    const token = makeDefaultToken(RoleUsersEnum.MASTER);
    masterFacade.checkUserMasterFromToken.mockResolvedValueOnce(true);

    const result = await usecase.execute(token);

    expect(result).toBe(true);
    expect(masterFacade.checkUserMasterFromToken).toHaveBeenCalledWith(token);
    expect(masterFacade.checkUserMasterFromToken).toHaveBeenCalledTimes(1);
    expect(toRoleType).toHaveBeenCalledWith(RoleUsersEnum.MASTER);

    expect(adminFacade.checkUserAdministratorFromToken).not.toHaveBeenCalled();
    expect(teacherFacade.checkUserTeacherFromToken).not.toHaveBeenCalled();
    expect(studentFacade.checkUserStudentFromToken).not.toHaveBeenCalled();
    expect(workerFacade.checkUserWorkerFromToken).not.toHaveBeenCalled();
  });

  it('should call administrator facade and return boolean for ADMINISTRATOR role', async () => {
    const token = makeDefaultToken(RoleUsersEnum.ADMINISTRATOR);
    adminFacade.checkUserAdministratorFromToken.mockResolvedValueOnce(false);

    const result = await usecase.execute(token);

    expect(result).toBe(false);
    expect(adminFacade.checkUserAdministratorFromToken).toHaveBeenCalledWith(token);
    expect(adminFacade.checkUserAdministratorFromToken).toHaveBeenCalledTimes(1);
    expect(toRoleType).toHaveBeenCalledWith(RoleUsersEnum.ADMINISTRATOR);

    expect(masterFacade.checkUserMasterFromToken).not.toHaveBeenCalled();
    expect(teacherFacade.checkUserTeacherFromToken).not.toHaveBeenCalled();
    expect(studentFacade.checkUserStudentFromToken).not.toHaveBeenCalled();
    expect(workerFacade.checkUserWorkerFromToken).not.toHaveBeenCalled();
  });

  it('should call teacher facade and return boolean for TEACHER role', async () => {
    const token = makeDefaultToken(RoleUsersEnum.TEACHER);
    teacherFacade.checkUserTeacherFromToken.mockResolvedValueOnce(true);

    const result = await usecase.execute(token);

    expect(result).toBe(true);
    expect(teacherFacade.checkUserTeacherFromToken).toHaveBeenCalledWith(token);
    expect(teacherFacade.checkUserTeacherFromToken).toHaveBeenCalledTimes(1);
    expect(toRoleType).toHaveBeenCalledWith(RoleUsersEnum.TEACHER);

    expect(masterFacade.checkUserMasterFromToken).not.toHaveBeenCalled();
    expect(adminFacade.checkUserAdministratorFromToken).not.toHaveBeenCalled();
    expect(studentFacade.checkUserStudentFromToken).not.toHaveBeenCalled();
    expect(workerFacade.checkUserWorkerFromToken).not.toHaveBeenCalled();
  });

  it('should call student facade and return boolean for STUDENT role', async () => {
    const token = makeDefaultToken(RoleUsersEnum.STUDENT);
    studentFacade.checkUserStudentFromToken.mockResolvedValueOnce(true);

    const result = await usecase.execute(token);

    expect(result).toBe(true);
    expect(studentFacade.checkUserStudentFromToken).toHaveBeenCalledWith(token);
    expect(studentFacade.checkUserStudentFromToken).toHaveBeenCalledTimes(1);
    expect(toRoleType).toHaveBeenCalledWith(RoleUsersEnum.STUDENT);

    expect(masterFacade.checkUserMasterFromToken).not.toHaveBeenCalled();
    expect(adminFacade.checkUserAdministratorFromToken).not.toHaveBeenCalled();
    expect(teacherFacade.checkUserTeacherFromToken).not.toHaveBeenCalled();
    expect(workerFacade.checkUserWorkerFromToken).not.toHaveBeenCalled();
  });

  it('should call worker facade and return boolean for WORKER role', async () => {
    const token = makeDefaultToken(RoleUsersEnum.WORKER);
    workerFacade.checkUserWorkerFromToken.mockResolvedValueOnce(false);

    const result = await usecase.execute(token);

    expect(result).toBe(false);
    expect(workerFacade.checkUserWorkerFromToken).toHaveBeenCalledWith(token);
    expect(workerFacade.checkUserWorkerFromToken).toHaveBeenCalledTimes(1);
    expect(toRoleType).toHaveBeenCalledWith(RoleUsersEnum.WORKER);

    expect(masterFacade.checkUserMasterFromToken).not.toHaveBeenCalled();
    expect(adminFacade.checkUserAdministratorFromToken).not.toHaveBeenCalled();
    expect(teacherFacade.checkUserTeacherFromToken).not.toHaveBeenCalled();
    expect(studentFacade.checkUserStudentFromToken).not.toHaveBeenCalled();
  });

  it('should throw InternalError for invalid role', async () => {
    //@ts-expect-error
    const token = {
      id: 'user-id-123',
      email: 'user@test.com',
      role: 'INVALID_ROLE',
    } as TokenData;

    await expect(usecase.execute(token)).rejects.toBeInstanceOf(InternalError);
    await expect(usecase.execute(token)).rejects.toThrow('Internal server error');

    expect(toRoleType).toHaveBeenCalledWith('INVALID_ROLE');

    expect(masterFacade.checkUserMasterFromToken).not.toHaveBeenCalled();
    expect(adminFacade.checkUserAdministratorFromToken).not.toHaveBeenCalled();
    expect(teacherFacade.checkUserTeacherFromToken).not.toHaveBeenCalled();
    expect(studentFacade.checkUserStudentFromToken).not.toHaveBeenCalled();
    expect(workerFacade.checkUserWorkerFromToken).not.toHaveBeenCalled();
  });
});
