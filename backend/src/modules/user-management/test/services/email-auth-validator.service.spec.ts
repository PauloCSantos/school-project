import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { EmailAuthValidatorService } from '../../application/services/email-auth-validator.service';

describe('EmailAuthValidatorService', () => {
  let mockAuthUserRepository: jest.Mocked<AuthUserGateway>;
  let service: EmailAuthValidatorService;

  beforeEach(() => {
    // Create a mock for AuthUserGateway
    mockAuthUserRepository = {
      verify: jest.fn(),
      // Other methods can be left unimplemented for this test
    } as unknown as jest.Mocked<AuthUserGateway>;

    service = new EmailAuthValidatorService(mockAuthUserRepository);
  });

  it('should return true if the email exists', async () => {
    mockAuthUserRepository.verify.mockResolvedValue(true);

    const result = await service.validate('email@test.com');
    expect(result).toBe(true);
    expect(mockAuthUserRepository.verify).toHaveBeenCalledWith(
      'email@test.com'
    );
  });

  it('should return false if the email does not exist', async () => {
    mockAuthUserRepository.verify.mockResolvedValue(false);

    const result = await service.validate('nonexistent@test.com');
    expect(result).toBe(false);
    expect(mockAuthUserRepository.verify).toHaveBeenCalledWith(
      'nonexistent@test.com'
    );
  });
});
