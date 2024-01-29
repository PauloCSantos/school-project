import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/user-administrator.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteUserAdministrator usecase unit test', () => {
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

  const userAdministrator = new UserAdministrator({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
    graduation: input.graduation,
  });

  describe('On fail', () => {
    it('should return an error if the user does not exist', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteUserAdministrator(userAdministratorRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should delete a user administrator', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(userAdministrator);
      const usecase = new DeleteUserAdministrator(userAdministratorRepository);
      const result = await usecase.execute({
        id: userAdministrator.id.id,
      });

      expect(userAdministratorRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
