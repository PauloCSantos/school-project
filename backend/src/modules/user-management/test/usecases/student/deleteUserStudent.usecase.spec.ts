import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

describe('deleteUserStudent usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
    };
  };

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
    it('should return an error if the user does not exist', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new DeleteUserStudent(userStudentRepository);

      await expect(
        usecase.execute(
          { id: '75c791ca-7a40-4217-8b99-2cf22c01d543' },
          policieService,
          token
        )
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should delete a user student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(userStudent);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new DeleteUserStudent(userStudentRepository);
      const result = await usecase.execute(
        {
          id: userStudent.id.value,
        },
        policieService,
        token
      );

      expect(userStudentRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
