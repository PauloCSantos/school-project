import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/user-student.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(userStudent => Promise.resolve(userStudent)),
    delete: jest.fn(),
  };
};

describe('updateUserStudent usecase unit test', () => {
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
    paymentYear: 25000,
  };

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

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateUserStudent(userStudentRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(userStudent1);
      const usecase = new UpdateUserStudent(userStudentRepository);

      const result = await usecase.execute({
        id: userStudent1.id.id,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
        paymentYear: input.paymentYear,
      });

      expect(userStudentRepository.update).toHaveBeenCalled();
      expect(userStudentRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        name: {
          fullName: userStudent1.name.fullName(),
          shortName: userStudent1.name.shortName(),
        },
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        paymentYear: 'R$ 25000',
      });
    });
  });
});
