import { Role } from '../../../core/types/role.type';

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
}
