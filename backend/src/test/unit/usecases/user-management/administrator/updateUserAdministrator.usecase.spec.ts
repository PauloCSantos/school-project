import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/user-administrator.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(userAdministrator => Promise.resolve(userAdministrator)),
    delete: jest.fn(),
  };
};

describe('updateUserAdministrator usecase unit test', () => {
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
  };

  const userAdministrator1 = new UserAdministrator({
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
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateUserAdministrator(userAdministratorRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user administrator', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(userAdministrator1);
      const usecase = new UpdateUserAdministrator(userAdministratorRepository);

      const result = await usecase.execute({
        id: userAdministrator1.id.id,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
      });

      expect(userAdministratorRepository.find).toHaveBeenCalled();
      expect(userAdministratorRepository.update).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userAdministrator1.id.id,
        name: {
          fullName: userAdministrator1.name.fullName(),
          shortName: userAdministrator1.name.shortName(),
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
        salary: userAdministrator1.salary.calculateTotalIncome(),
        graduation: 'Math',
      });
    });
  });
});
