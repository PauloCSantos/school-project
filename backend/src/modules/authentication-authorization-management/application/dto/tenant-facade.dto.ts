import {
  ICreateTenantInput,
  IDeleteTenantInput,
  IFindTenantInput,
  IFindTenantOutput,
  IUpdateTenantInput,
} from './base-tenant.dto';

export type FindTenantInputDto = IFindTenantInput;
export type FindTenantOutputDto = IFindTenantOutput;

export type CreateTenantInputDto = ICreateTenantInput;

export type UpdateTenantInputDto = IUpdateTenantInput;

export type DeleteTenantInputDto = IDeleteTenantInput;
