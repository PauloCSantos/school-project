import AddStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/add-students.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/application/gateway/attendance.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('AddStudents use case unit test', () => {
  let attendance: Attendance;
  let token: TokenData;
  let input: { id: string; newStudentsList: string[] };
  let policiesService: jest.Mocked<PoliciesServiceInterface>;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudent: jest.fn((_, newStudentsList) =>
        Promise.resolve(
          `${newStudentsList.length} ${
            newStudentsList.length === 1 ? 'value was' : 'values were'
          } entered`
        )
      ),
      removeStudent: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });

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
      newStudentsList: [new Id().value, new Id().value],
    };
    policiesService = MockPolicyService();
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
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(null);

      const usecase = new AddStudents(attendanceRepository, policiesService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Attendance not found'
      );
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).not.toHaveBeenCalled();
    });

    it('should throw an error if the student already exists in the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new AddStudents(attendanceRepository, policiesService);

      await expect(
        usecase.execute(
          {
            ...input,
            newStudentsList: [attendance.studentsPresent[0]],
          },
          token
        )
      ).rejects.toThrow(`This student is already on the attendance`);
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add students to the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new AddStudents(attendanceRepository, policiesService);
      const result = await usecase.execute(input, token);

      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).toHaveBeenCalledWith(
        input.id,
        input.newStudentsList
      );
      expect(result.message).toBe(`2 values were entered`);
    });

    it('should handle adding a single student correctly', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new AddStudents(attendanceRepository, policiesService);
      const singleStudentInput = {
        id: input.id,
        newStudentsList: [new Id().value],
      };
      const result = await usecase.execute(singleStudentInput, token);

      expect(attendanceRepository.find).toHaveBeenCalledWith(
        singleStudentInput.id
      );
      expect(attendanceRepository.addStudent).toHaveBeenCalledWith(
        singleStudentInput.id,
        singleStudentInput.newStudentsList
      );
      expect(result.message).toBe(`1 value was entered`);
    });
  });
});
