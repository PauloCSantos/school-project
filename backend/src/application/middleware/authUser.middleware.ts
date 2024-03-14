import TokenService from '@/modules/authentication-authorization-management/domain/service/token.service';
import { isNotEmpty } from '@/util/validations';

export default class AuthUserMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly allowedRoles: RoleUsers[]
  ) {}

  public async handle(req: any, res: any, next: () => void): Promise<void> {
    try {
      const authorizationHeader = req.headers.authorization;
      if (
        authorizationHeader === undefined ||
        !isNotEmpty(authorizationHeader)
      ) {
        throw new Error('Missing Token');
      }

      //const token = authorizationHeader.split(' ')[1];
      const token = authorizationHeader;

      const decodedToken = await this.tokenService.validateToken(token);
      if (decodedToken === null) {
        throw new Error('Invalid token');
      }
      const { email, role, masterId } = decodedToken;

      if (!this.allowedRoles.includes(role as RoleUsers)) {
        throw new Error('User does not have access permission');
      }

      req.tokenData = { email, role, masterId };

      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Missing Token') {
          res.status(401).json({ error: error.message });
        } else if (error.message === 'Invalid token') {
          res.status(401).json({ error: error.message });
        } else if (error.message === 'User does not have access permission') {
          res.status(403).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
