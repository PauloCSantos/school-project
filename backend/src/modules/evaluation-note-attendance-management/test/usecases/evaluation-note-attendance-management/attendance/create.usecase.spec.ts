import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/create.usecase';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

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

describe('CreateAttendance usecase unit test', () => {
  let input: any;
  let repository: jest.Mocked<AttendanceGateway>;
  let usecase: CreateAttendance;

  beforeEach(() => {
    input = {
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    };
    repository = MockRepository();
    usecase = new CreateAttendance(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an attendance and return its id', async () => {
    repository.find.mockResolvedValueOnce(undefined);

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalledWith(expect.any(String));
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(typeof result.id).toBe('string');
  });

  it('should check if attendance already exists before creating', async () => {
    repository.find.mockResolvedValueOnce(undefined);

    await usecase.execute(input);

    expect(repository.find).toHaveBeenCalledWith(expect.any(String));
    expect(repository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if attendance already exists', async () => {
    repository.find.mockResolvedValueOnce(new Attendance(input));

    await expect(usecase.execute(input)).rejects.toThrow(
      'Attendance already exists'
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should pass the correct entity to repository.create', async () => {
    repository.find.mockResolvedValueOnce(undefined);

    await usecase.execute(input);

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
    repository.find.mockResolvedValueOnce(undefined);
    repository.create.mockResolvedValueOnce(expectedId);

    const result = await usecase.execute(input);

    expect(result.id).toEqual(expectedId);
  });
});
