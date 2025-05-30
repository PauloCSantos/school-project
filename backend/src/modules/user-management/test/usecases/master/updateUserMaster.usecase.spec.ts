import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(userMaster => Promise.resolve(userMaster)),
  };
};

describe('updateUserMaster usecase unit test', () => {
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
    cnpj: '35.741.901/0001-58',
  };

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

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateUserMaster(userMasterRepository);

      await expect(
        usecase.execute({
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          ...input,
        })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user administrator', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.find.mockResolvedValue(userMaster1);
      const usecase = new UpdateUserMaster(userMasterRepository);

      const result = await usecase.execute({
        id: userMaster1.id.value,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
      });

      expect(userMasterRepository.update).toHaveBeenCalled();
      expect(userMasterRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userMaster1.id.value,
        name: {
          fullName: userMaster1.name.fullName(),
          shortName: userMaster1.name.shortName(),
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
        cnpj: '35.741.901/0001-58',
      });
    });
  });
});
