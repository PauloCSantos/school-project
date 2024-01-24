import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/teacher/domain/entity/user-teacher.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllUserTeacher usecase unit test', () => {
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
      const usecase = new FindAllUserTeacher(userTeacherRepository);

      const result = await usecase.execute({});

      expect(userTeacherRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllUserTeacher(userTeacherRepository);

      const result = await usecase.execute({});

      expect(userTeacherRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
