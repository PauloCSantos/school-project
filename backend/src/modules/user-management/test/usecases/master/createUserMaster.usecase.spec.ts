import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
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
    id: new Id().id,
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
    id: new Id(input.id),
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
      const result = await usecase.execute({ ...input });

      expect(userMasterRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userMasterRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
