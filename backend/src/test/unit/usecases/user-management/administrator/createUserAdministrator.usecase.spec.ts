import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/user-administrator.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userAdministrator =>
      Promise.resolve(userAdministrator.id.id)
    ),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createUserAdministrator usecase unit test', () => {
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
    it('should throw an error if the user already exists', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(userAdministrator);

      const usecase = new CreateUserAdministrator(userAdministratorRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'User already exists'
      );
      expect(userAdministratorRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userAdministratorRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a user administrator', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateUserAdministrator(userAdministratorRepository);
      const result = await usecase.execute(input);

      expect(userAdministratorRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userAdministratorRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined;
    });
  });
});
