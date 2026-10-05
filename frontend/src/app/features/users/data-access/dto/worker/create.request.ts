import { ApiSalaryRequest } from '../base/api.type';
import { BaseProfileCreateDto } from '../base/create.request';

export type WorkerCreateRequestDto = BaseProfileCreateDto & {
  salary: ApiSalaryRequest;
};
