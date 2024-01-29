import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/user-student.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllUserStudent usecase unit test', () => {
  const userStudent1 = new UserStudent({
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
    paymentYear: 20000,
  });
  const userStudent2 = new UserStudent({
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
    paymentYear: 45000,
  });

  describe('On success', () => {
    it('should find all users student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.findAll.mockResolvedValue([
        userStudent1,
        userStudent2,
      ]);
      const usecase = new FindAllUserStudent(userStudentRepository);

      const result = await usecase.execute({});

      expect(userStudentRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllUserStudent(userStudentRepository);

      const result = await usecase.execute({});

      expect(userStudentRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
