import Id from '@/modules/@shared/domain/value-object/id.value-object';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/user-entity.service';
import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';

// Mock do repositório
const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

// Mock para o AuthUserService implementando a classe corretamente
jest.mock(
  '@/modules/authentication-authorization-management/domain/service/user-entity.service'
);

// Mock para o TokenService
jest.mock(
  '@/modules/authentication-authorization-management/domain/service/token.service'
);

describe('LoginAuthUser usecase unit test', () => {
  // Dados de mock para o usuário
  const mockUserData = {
    email: 'teste@teste.com.br',
    password: 'hashed_password',
    masterId: new Id().value,
    role: 'master' as RoleUsers,
    isHashed: true,
  };

  // Limpar todos os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('Should login with correct credentials', async () => {
      // Arrange
      const authUserRepository = MockRepository();

      // Configurar o mock do serviço de usuário
      const authUserService =
        new AuthUserService() as jest.Mocked<AuthUserService>;
      authUserService.comparePassword = jest.fn().mockResolvedValue(true);

      // Configurar o mock do serviço de token
      const tokenService = new TokenService(
        'secret'
      ) as jest.Mocked<TokenService>;
      tokenService.generateToken = jest.fn().mockResolvedValue('mocked_token');

      // Configurando o mock do repositório para retornar os dados do usuário
      authUserRepository.find.mockResolvedValue(mockUserData);

      // Instanciando o caso de uso com as dependências mockadas
      const usecase = new LoginAuthUser(
        authUserRepository,
        authUserService,
        tokenService
      );

      // Act
      const result = await usecase.execute({
        email: 'teste@teste.com.br',
        password: 'ioNO9V',
        //role: 'master' as RoleUsers,
        role: 'master',
      });

      // Assert
      expect(authUserRepository.find).toHaveBeenCalledWith(
        'teste@teste.com.br'
      );
      expect(authUserService.comparePassword).toHaveBeenCalled();
      expect(tokenService.generateToken).toHaveBeenCalled();
      expect(result).toEqual({ token: 'mocked_token' });
    });
  });

  describe('On failure', () => {
    it('Should throw error when user is not found', async () => {
      // Arrange
      const authUserRepository = MockRepository();
      const authUserService =
        new AuthUserService() as jest.Mocked<AuthUserService>;
      const tokenService = new TokenService(
        'secret'
      ) as jest.Mocked<TokenService>;

      // Configurando o mock do repositório para retornar null (usuário não encontrado)
      authUserRepository.find.mockResolvedValue(null);

      // Instanciando o caso de uso com as dependências mockadas
      const usecase = new LoginAuthUser(
        authUserRepository,
        authUserService,
        tokenService
      );

      // Act & Assert
      await expect(
        usecase.execute({
          email: 'nonexistent@teste.com.br',
          password: 'any_password',
          role: 'master' as RoleUsers,
        })
      ).rejects.toThrow(
        'Invalid credentials. Please check your email and password and try again'
      );
    });

    it('Should throw error when password is invalid', async () => {
      // Arrange
      const authUserRepository = MockRepository();

      // Configurar o mock do serviço de usuário para rejeitar a senha
      const authUserService =
        new AuthUserService() as jest.Mocked<AuthUserService>;
      authUserService.comparePassword = jest.fn().mockResolvedValue(false);

      const tokenService = new TokenService(
        'secret'
      ) as jest.Mocked<TokenService>;

      // Configurando o mock do repositório para retornar os dados do usuário
      authUserRepository.find.mockResolvedValue(mockUserData);

      // Instanciando o caso de uso com as dependências mockadas
      const usecase = new LoginAuthUser(
        authUserRepository,
        authUserService,
        tokenService
      );

      // Act & Assert
      await expect(
        usecase.execute({
          email: 'teste@teste.com.br',
          password: 'wrong_password',
          role: 'master' as RoleUsers,
        })
      ).rejects.toThrow(
        'Invalid credentials. Please check your email and password and try again'
      );
    });
  });
});
