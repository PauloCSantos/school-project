import { ApiSalaryResponse } from '../base/api.type';
import { BaseProfileListItemDto } from '../base/list.response';

export type AdministratorItemResponseDto = Readonly<
  BaseProfileListItemDto & {
    graduation: string;
    salary: ApiSalaryResponse;
  }
>;

export type AdministratorListResponseDto = ReadonlyArray<AdministratorItemResponseDto>;
