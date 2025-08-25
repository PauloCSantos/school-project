import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserMaster usecase unit test', () => {
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

  const userBase = new UserBase({
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
  });
  const userMaster1 = new UserMaster({
    userId: userBase.id.value,
    cnpj: '35.741.901/0001-58',
  });

  describe('On success', () => {
    it('should find an user master', async () => {
      const userMasterRepository = MockRepository();
      const userService = MockUserService();

      userService.findBaseUser.mockResolvedValue(userBase);
      userMasterRepository.find.mockResolvedValue(userMaster1);

      const usecase = new FindUserMaster(
        userMasterRepository,
        policieService,
        userService
      );

      const result = await usecase.execute({ id: userMaster1.id.value }, token);

      expect(userMasterRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      const userMasterRepository = MockRepository();
      const userService = MockUserService();

      userService.findBaseUser.mockResolvedValue(userBase);
      userMasterRepository.find.mockResolvedValue(null);

      const usecase = new FindUserMaster(
        userMasterRepository,
        policieService,
        userService
      );
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        token
      );

      expect(result).toBeNull();
    });
  });
});
