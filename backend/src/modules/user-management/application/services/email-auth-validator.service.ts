import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';

export interface EmailAuthValidator {
  validate(email: string): Promise<boolean>;
}

export class EmailAuthValidatorService implements EmailAuthValidator {
  constructor(readonly authUserRepository: AuthUserGateway) {}
  async validate(email: string): Promise<boolean> {
    return await this.authUserRepository.verify(email);
  }
}
