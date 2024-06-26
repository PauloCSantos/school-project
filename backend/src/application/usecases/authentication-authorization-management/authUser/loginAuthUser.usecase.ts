import {
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
} from '@/application/dto/authentication-authorization-management/authUser-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AuthUserGateway from '@/infraestructure/gateway/authentication-authorization-management/authUser.gateway';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/authUser-entity.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/authUser.entity';
import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';

export default class LoginAuthUser
  implements UseCaseInterface<LoginAuthUserInputDto, LoginAuthUserOutputDto>
{
  private _authUserRepository: AuthUserGateway;

  constructor(authUserRepository: AuthUserGateway) {
    this._authUserRepository = authUserRepository;
  }
  async execute({
    email,
    password,
    role,
  }: LoginAuthUserInputDto): Promise<LoginAuthUserOutputDto> {
    try {
      const authUserVerification = await this._authUserRepository.find(email);
      if (!authUserVerification)
        throw new Error(
          'Invalid credentials. Please check your email and password and try again'
        );
      const authUserService = new AuthUserService();
      const authUser = new AuthUser(
        {
          email: authUserVerification.email,
          password: authUserVerification.password,
          role: authUserVerification.role,
          masterId: authUserVerification.masterId,
          isHashed: authUserVerification.isHashed,
        },
        authUserService
      );
      const isValid = await authUser.comparePassword(password);
      if (isValid) {
        const tokenService = new TokenService('ax532a');
        const token = await tokenService.generateToken(authUser);
        return { token };
      } else {
        throw new Error(
          'Invalid credentials. Please check your email and password and try again'
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
