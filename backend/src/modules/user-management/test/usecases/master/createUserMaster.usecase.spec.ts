import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('createUserMaster usecase unit test', () => {
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
      findBaseUserByEmail: jest.fn(),
    };
  };

  const MockEmailAuthValidatorService = () => ({
    validate: jest.fn().mockResolvedValue(true),
  });

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
    id: new Id().value,
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

  const userBase = new UserBase({
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

  const userMaster = new UserMaster({
    id: new Id(input.id).value,
    userId: userBase.id.value,
    cnpj: input.cnpj,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userMasterRepository = MockRepository();
      const userService = MockUserService();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userService.getOrCreateUser.mockResolvedValue(userBase);
      userMasterRepository.findByBaseUserId.mockResolvedValue(userMaster);

      const usecase = new CreateUserMaster(
        userMasterRepository,
        emailAuthValidatorService,
        policieService,
        userService
      );

      await expect(
        usecase.execute(
          {
            ...input,
          },
          token
        )
      ).rejects.toThrow('User already exists');
      expect(userMasterRepository.findByBaseUserId).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userMasterRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(input.email);
    });
  });

  describe('On success', () => {
    it('should create a user master', async () => {
      const userMasterRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();
      const userService = MockUserService();

      userService.getOrCreateUser.mockResolvedValue(userBase);
      userMasterRepository.findByBaseUserId.mockResolvedValue(null);
      userMasterRepository.create.mockResolvedValue({
        id: userMaster.id.value,
      });

      const usecase = new CreateUserMaster(
        userMasterRepository,
        emailAuthValidatorService,
        policieService,
        userService
      );
      const result = await usecase.execute({ ...input }, token);

      expect(userMasterRepository.findByBaseUserId).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userMasterRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(input.email);
    });
  });
});
