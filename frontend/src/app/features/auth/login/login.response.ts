import { Role } from '../../../core/types/role.type';

export type TenantOption = Readonly<{
  id: string;
  roles: Role[];
}>;

export type LoginDiscoverResponse = Readonly<{ data: ReadonlyArray<TenantOption> }>;

export type LoginSessionResponse = Readonly<{
  token: string;
}>;
