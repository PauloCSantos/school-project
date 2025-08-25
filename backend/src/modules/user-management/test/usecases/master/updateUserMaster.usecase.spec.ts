import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('updateUserMaster usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByBaseUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  };
  const MockUserService = () => {
    return {
      getOrCreateUser: jest.fn(),
      findBaseUsers: jest.fn(),
      findBaseUser: jest.fn(),
      update: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

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

  const userBase = new UserBase({
    name: new Name(input.name),
    address: new Address(input.address),
    birthday: input.birthday,
    email: input.email,
  });
  const userMaster1 = new UserMaster({
    userId: userBase.id.value,
    cnpj: '35.741.901/0001-58',
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userMasterRepository = MockRepository();
      const userService = MockUserService();

      userMasterRepository.find.mockResolvedValue(null);

      const usecase = new UpdateUserMaster(
        userMasterRepository,
        policieService,
        userService
      );

      await expect(
        usecase.execute(
          {
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
            ...input,
          },
          token
        )
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user administrator', async () => {
      const userMasterRepository = MockRepository();
      const userService = MockUserService();

      userMasterRepository.find.mockResolvedValue(userMaster1);
      userMasterRepository.update.mockResolvedValue(userMaster1);
      userService.findBaseUser.mockResolvedValue(userBase);
      userService.update.mockResolvedValue(userBase);

      const usecase = new UpdateUserMaster(
        userMasterRepository,
        policieService,
        userService
      );

      const result = await usecase.execute(
        {
          id: userMaster1.id.value,
          address: {
            street: 'Street B',
            city: 'City B',
            zip: '111111-111',
            number: 1,
            avenue: 'Avenue B',
            state: 'State B',
          },
        },
        token
      );

      expect(userMasterRepository.update).toHaveBeenCalled();
      expect(userMasterRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userMaster1.id.value,
        name: {
          fullName: userBase.name.fullName(),
          shortName: userBase.name.shortName(),
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
