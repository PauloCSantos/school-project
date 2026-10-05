import { ApiSalaryResponse } from '../base/api.type';
import { BaseProfileListItemDto } from '../base/list.response';

export type WorkerItemResponseDto = Readonly<
  BaseProfileListItemDto & {
    salary: ApiSalaryResponse;
  }
>;

export type WorkerListResponseDto = ReadonlyArray<WorkerItemResponseDto>;
