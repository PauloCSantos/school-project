import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('createUserMaster usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userMasterRepository.findByEmail.mockResolvedValue(userMaster);

      const usecase = new CreateUserMaster(
        userMasterRepository,
        emailAuthValidatorService,
        policieService
      );

      await expect(
        usecase.execute(
          {
            ...input,
          },
          token
        )
      ).rejects.toThrow('User already exists');
      expect(userMasterRepository.findByEmail).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userMasterRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });

  describe('On success', () => {
    it('should create a user master', async () => {
      const userMasterRepository = MockRepository();
      userMasterRepository.create.mockResolvedValue({
        id: userMaster.id.value,
      });
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userMasterRepository.findByEmail.mockResolvedValue(null);

      const usecase = new CreateUserMaster(
        userMasterRepository,
        emailAuthValidatorService,
        policieService
      );
      const result = await usecase.execute({ ...input }, token);

      expect(userMasterRepository.findByEmail).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userMasterRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });
});
