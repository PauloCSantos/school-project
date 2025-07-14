import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find-all.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('FindAllAttendance usecase unit test', () => {
  let attendance1: Attendance;
  let attendance2: Attendance;
  let token: TokenData;
  let policieService: jest.Mocked<PoliciesServiceInterface>;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
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
    policieService = MockPolicyService();
    token = {
      email: 'caller@domain.com',
      role: 'master',
      masterId: new Id().value,
    };

    attendance1 = new Attendance({
      date: new Date(),
      day: 'fri',
      hour: '06:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
    attendance2 = new Attendance({
      date: new Date(),
      day: 'sat',
      hour: '13:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('should find all attendances', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockResolvedValue([
        attendance1,
        attendance2,
      ]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllAttendance(attendanceRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(attendanceRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });

    it('should return an empty array when the repository is empty', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockResolvedValue([]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllAttendance(attendanceRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(attendanceRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });

  describe('On fail', () => {
    it('should throw an error if repository.findAll fails', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockRejectedValueOnce(
        new Error('Database error')
      );
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllAttendance(attendanceRepository);

      await expect(usecase.execute({}, policieService, token)).rejects.toThrow(
        'Database error'
      );
      expect(attendanceRepository.findAll).toHaveBeenCalled();
    });
  });
});
