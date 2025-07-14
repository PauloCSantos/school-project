import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

describe('createUserTeacher usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => ({
    find: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userTeacher => Promise.resolve(userTeacher.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const MockEmailAuthValidatorService = () => ({
    validate: jest.fn().mockResolvedValue(true),
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const input = {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    },
    salary: {
      salary: 5000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    graduation: 'Math',
    academicDegrees: 'Msc',
  };

  const userTeacher = new UserTeacher({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
    graduation: input.graduation,
    academicDegrees: input.academicDegrees,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userTeacherRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userTeacherRepository.findByEmail.mockResolvedValue(userTeacher);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateUserTeacher(
        userTeacherRepository,
        emailAuthValidatorService
      );

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('User already exists');
      expect(userTeacherRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userTeacherRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });

  describe('On success', () => {
    it('should create a user teacher', async () => {
      const userTeacherRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userTeacherRepository.findByEmail.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateUserTeacher(
        userTeacherRepository,
        emailAuthValidatorService
      );
      const result = await usecase.execute(input, policieService, token);

      expect(userTeacherRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userTeacherRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });
});
