import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserStudent from '@/modules/user-management/student/domain/entity/user-student.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userStudent => Promise.resolve(userStudent.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createUserStudent usecase unit test', () => {
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
      userStudentRepository.find.mockResolvedValue(userStudent);

      const usecase = new CreateUserStudent(userStudentRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'User already exists'
      );
      expect(userStudentRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userStudentRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a user student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateUserStudent(userStudentRepository);
      const result = await usecase.execute(input);

      expect(userStudentRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userStudentRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined;
    });
  });
});
