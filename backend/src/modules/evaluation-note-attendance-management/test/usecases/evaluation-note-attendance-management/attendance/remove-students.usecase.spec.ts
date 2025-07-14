import RemoveStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/remove-students.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('RemoveStudents usecase unit test', () => {
  let attendance: Attendance;
  let attendanceRepository: jest.Mocked<AttendanceGateway>;
  let usecase: RemoveStudents;
  let input: { id: string; studentsListToRemove: string[] };
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudent: jest.fn(),
      removeStudent: jest.fn((_, studentsListToRemove) =>
        Promise.resolve(
          `${studentsListToRemove.length} ${
            studentsListToRemove.length === 1 ? 'value was' : 'values were'
          } removed`
        )
      ),
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
      studentsListToRemove: [
        attendance.studentsPresent[0],
        attendance.studentsPresent[1],
      ],
    };
    attendanceRepository = MockRepository();
    policieService = MockPolicyService();
    usecase = new RemoveStudents(attendanceRepository);
    token = {
      email: 'caller@domain.com',
      role: 'master',
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On fail', () => {
    it('should throw an error if the attendance does not exist', async () => {
      attendanceRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Attendance not found');
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).not.toHaveBeenCalled();
    });

    it('should throw an error if the student does not exist in the attendance', async () => {
      attendanceRepository.find.mockResolvedValue(attendance);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      await expect(
        usecase.execute(
          {
            ...input,
            studentsListToRemove: [new Id().value],
          },
          policieService,
          token
        )
      ).rejects.toThrow('This student is not included in the attendance');
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students from the attendance', async () => {
      attendanceRepository.find.mockResolvedValue(attendance);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const result = await usecase.execute(input, policieService, token);

      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).toHaveBeenCalledWith(
        input.id,
        input.studentsListToRemove
      );
      expect(result.message).toBe('2 values were removed');
    });
  });
});
