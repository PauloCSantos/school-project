import FindUserTeacher from '@/modules/user-management/application/usecases/teacher/findUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findUserTeacher usecase unit test', () => {
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
  describe('On success', () => {
    it('should find an user teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(userTeacher1);
      const usecase = new FindUserTeacher(userTeacherRepository);

      const result = await usecase.execute({ id: userTeacher1.id.value });

      expect(userTeacherRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(undefined);

      const usecase = new FindUserTeacher(userTeacherRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
