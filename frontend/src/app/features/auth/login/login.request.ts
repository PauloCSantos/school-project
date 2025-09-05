import { Role } from '../../../core/types/role.type';

export type LoginDiscoverRequest = Readonly<{
  email: string;
  password: string;
  role: Role;
}>;

export type LoginSessionRequest = Readonly<{
  email: string;
  password: string;
  masterId: string;
  role: Role;
}>;
