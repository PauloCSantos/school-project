import { Role } from '../../../domain/users/role.type';

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
}
