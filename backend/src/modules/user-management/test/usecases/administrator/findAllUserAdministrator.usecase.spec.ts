import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllUserAdministrator usecase unit test', () => {
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
  const userAdministrator2 = new UserAdministrator({
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
  });

  describe('On success', () => {
    it('should find all users administrator', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.findAll.mockResolvedValue([
        userAdministrator1,
        userAdministrator2,
      ]);
      const usecase = new FindAllUserAdministrator(userAdministratorRepository);

      const result = await usecase.execute({});

      expect(userAdministratorRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllUserAdministrator(userAdministratorRepository);

      const result = await usecase.execute({});

      expect(userAdministratorRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
