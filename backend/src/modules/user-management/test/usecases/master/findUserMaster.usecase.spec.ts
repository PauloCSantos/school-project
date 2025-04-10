import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe('findUserMaster usecase unit test', () => {
  const userMaster1 = new UserMaster({
    id: new Id(),
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
    cnpj: '35.741.901/0001-58',
  });
  describe('On success', () => {
    it('should find an user master', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(userMaster1);
      const usecase = new FindUserMaster(userMasterRepository);

      const result = await usecase.execute({ id: userMaster1.id.value });

      expect(userMasterRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(undefined);

      const usecase = new FindUserMaster(userMasterRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
