import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/user-master.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    create: jest.fn(userMaster => Promise.resolve(userMaster.id.id)),
    update: jest.fn(),
  };
};

describe('createUserMaster usecase unit test', () => {
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
    cnpj: '35.741.901/0001-58',
  };

  const userMaster = new UserMaster({
    name: new Name(input.name),
    address: new Address(input.address),
    birthday: input.birthday,
    email: input.email,
    cnpj: input.cnpj,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(userMaster);

      const usecase = new CreateUserMaster(userMasterRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('User already exists');
      expect(userMasterRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userMasterRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a user administrator', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateUserMaster(userMasterRepository);
      const result = await usecase.execute({ ...input, id: userMaster.id.id });

      expect(userMasterRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userMasterRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined;
    });
  });
});
