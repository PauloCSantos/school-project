import DeleteAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/delete.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';

describe('DeleteAttendance usecase unit test', () => {
  let repository: jest.Mocked<AttendanceGateway>;
  let usecase: DeleteAttendance;
  let attendance: Attendance;
  let token: TokenData;
  let policieService: jest.Mocked<PoliciesServiceInterface>;

  const MockRepository = (): jest.Mocked<AttendanceGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn((_id: string) =>
        Promise.resolve('Operação concluída com sucesso')
      ),
      addStudent: jest.fn(),
      removeStudent: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  beforeEach(() => {
    repository = MockRepository();
    policieService = MockPolicyService();
    usecase = new DeleteAttendance(repository);

    token = {
      email: 'caller@domain.com',
      role: 'master',
      masterId: new Id().value,
    };

    attendance = new Attendance({
      date: new Date(),
      day: 'fri',
      hour: '06:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On fail', () => {
    it('should return an error if the attendance does not exist', async () => {
      repository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      await expect(
        usecase.execute(
          { id: '75c791ca-7a40-4217-8b99-2cf22c01d543' },
          policieService,
          token
        )
      ).rejects.toThrow('Attendance not found');

      expect(repository.find).toHaveBeenCalledWith(
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if repository.delete fails', async () => {
      repository.find.mockResolvedValue(attendance);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      repository.delete.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        usecase.execute({ id: attendance.id.value }, policieService, token)
      ).rejects.toThrow('Database error');

      expect(repository.find).toHaveBeenCalledWith(attendance.id.value);
      expect(repository.delete).toHaveBeenCalledWith(attendance.id.value);
    });
  });

  describe('On success', () => {
    it('should delete an attendance', async () => {
      repository.find.mockResolvedValue(attendance);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const result = await usecase.execute(
        { id: attendance.id.value },
        policieService,
        token
      );

      expect(repository.find).toHaveBeenCalledWith(attendance.id.value);
      expect(repository.delete).toHaveBeenCalledWith(attendance.id.value);
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
