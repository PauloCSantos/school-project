import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userTeacher => Promise.resolve(userTeacher.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createUserTeacher usecase unit test', () => {
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
      userTeacherRepository.find.mockResolvedValue(userTeacher);

      const usecase = new CreateUserTeacher(userTeacherRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'User already exists'
      );
      expect(userTeacherRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userTeacherRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a user teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateUserTeacher(userTeacherRepository);
      const result = await usecase.execute(input);

      expect(userTeacherRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userTeacherRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
