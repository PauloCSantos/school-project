import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserMaster from '@/modules/user-management/master/domain/entity/user-master.entity';

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
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
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
        id: userMaster1.id.id,
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
