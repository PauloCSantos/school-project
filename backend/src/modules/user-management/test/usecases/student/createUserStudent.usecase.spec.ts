import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

describe('createUserStudent usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(userStudent => Promise.resolve(userStudent.id.value)),
      update: jest.fn(),
      delete: jest.fn(),
    };
  };

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
    role: RoleUsersEnum.MASTER,
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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    paymentYear: 20000,
  };

  const userStudent = new UserStudent({
    name: new Name(input.name),
    address: new Address(input.address),
    birthday: input.birthday,
    email: input.email,
    paymentYear: input.paymentYear,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userStudentRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userStudentRepository.findByEmail.mockResolvedValue(userStudent);

      const usecase = new CreateUserStudent(
        userStudentRepository,
        emailAuthValidatorService,
        policieService
      );

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'User already exists'
      );
      expect(userStudentRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userStudentRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });

  describe('On success', () => {
    it('should create a user student', async () => {
      const userStudentRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userStudentRepository.findByEmail.mockResolvedValue(null);

      const usecase = new CreateUserStudent(
        userStudentRepository,
        emailAuthValidatorService,
        policieService
      );
      const result = await usecase.execute(input, token);

      expect(userStudentRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userStudentRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });
});
