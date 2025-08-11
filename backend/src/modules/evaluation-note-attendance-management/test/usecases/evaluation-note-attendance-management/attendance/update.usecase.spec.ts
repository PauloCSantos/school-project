import UpdateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/update.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('UpdateAttendance usecase unit test', () => {
  let attendance: Attendance;
  let attendanceRepository: jest.Mocked<AttendanceGateway>;
  let usecase: UpdateAttendance;
  let input: { id: string; day: DayOfWeek; hour: Hour };
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(attendance => Promise.resolve(attendance)),
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
    attendance = new Attendance({
      date: new Date(),
      day: 'fri',
      hour: '06:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
    input = {
      id: attendance.id.value,
      day: 'thu' as DayOfWeek,
      hour: '13:40' as Hour,
    };
    attendanceRepository = MockRepository();
    policieService = MockPolicyService();
    usecase = new UpdateAttendance(attendanceRepository, policieService);
    token = {
      email: 'caller@domain.com',
      role: RoleUsersEnum.MASTER,
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On fail', () => {
    it('should throw an error if the attendance does not exist', async () => {
      attendanceRepository.find.mockResolvedValue(null);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Attendance not found'
      );
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
    });
  });

  describe('On success', () => {
    it('should update an attendance', async () => {
      attendanceRepository.find.mockResolvedValue(attendance);

      const result = await usecase.execute(input, token);

      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.update).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expect.objectContaining(input));
    });
  });
});
