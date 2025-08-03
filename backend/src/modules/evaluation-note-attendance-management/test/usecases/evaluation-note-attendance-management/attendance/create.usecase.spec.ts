import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/create.usecase';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('CreateAttendance usecase unit test', () => {
  let input: any;
  let repository: jest.Mocked<AttendanceGateway>;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;
  let usecase: CreateAttendance;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(attendance => Promise.resolve(attendance.id.value)),
      update: jest.fn(),
      delete: jest.fn(),
      addStudent: jest.fn(),
      removeStudent: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  beforeEach(() => {
    input = {
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    };
    repository = MockRepository();
    policieService = MockPolicyService();
    token = {
      email: 'caller@domain.com',
      role: RoleUsersEnum.MASTER,
      masterId: new Id().value,
    };
    usecase = new CreateAttendance(repository, policieService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an attendance and return its id', async () => {
    repository.find.mockResolvedValueOnce(null);

    const result = await usecase.execute(input, token);

    expect(repository.find).toHaveBeenCalledWith(expect.any(String));
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(typeof result.id).toBe('string');
  });

  it('should check if attendance already exists before creating', async () => {
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(input, token);

    expect(repository.find).toHaveBeenCalledWith(expect.any(String));
    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if attendance already exists', async () => {
    repository.find.mockResolvedValueOnce(new Attendance(input));

    await expect(usecase.execute(input, token)).rejects.toThrow(
      'Attendance already exists'
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should pass the correct entity to repository.create', async () => {
    repository.find.mockResolvedValueOnce(null);

    await usecase.execute(input, token);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        date: input.date,
        day: input.day,
        hour: input.hour,
        lesson: input.lesson,
        studentsPresent: input.studentsPresent,
      })
    );
  });

  it('should return the result from repository.create', async () => {
    const expectedId = 'some-id';
    repository.find.mockResolvedValueOnce(null);
    repository.create.mockResolvedValueOnce(expectedId);

    const result = await usecase.execute(input, token);

    expect(result.id).toEqual(expectedId);
  });
});
