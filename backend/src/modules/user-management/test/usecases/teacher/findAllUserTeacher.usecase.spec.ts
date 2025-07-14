import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllUserTeacher from '@/modules/user-management/application/usecases/teacher/findAllUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

describe('findAllUserTeacher usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  const userTeacher1 = new UserTeacher({
    name: new Name({
      firstName: 'John',
      middleName: 'David',
      lastName: 'Doe',
    }),
    address: new Address({
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    }),
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    salary: new Salary({ salary: 2500 }),
    graduation: 'Math',
    academicDegrees: 'Msc',
  });
  const userTeacher2 = new UserTeacher({
    name: new Name({
      firstName: 'Marie',
      lastName: 'Mason',
    }),
    address: new Address({
      street: 'Street B',
      city: 'City B',
      zip: '111111-222',
      number: 2,
      avenue: 'Avenue B',
      state: 'State B',
    }),
    birthday: new Date('05-24-1995'),
    email: 'teste2@test.com',
    salary: new Salary({ salary: 8500 }),
    graduation: 'Spanish',
    academicDegrees: 'Dr.',
  });

  describe('On success', () => {
    it('should find all users teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.findAll.mockResolvedValue([
        userTeacher1,
        userTeacher2,
      ]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new FindAllUserTeacher(userTeacherRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(userTeacherRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.findAll.mockResolvedValue([]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new FindAllUserTeacher(userTeacherRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(userTeacherRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
