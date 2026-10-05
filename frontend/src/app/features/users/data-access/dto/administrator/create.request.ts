import { ApiSalaryRequest } from '../base/api.type';
import { BaseProfileCreateDto } from '../base/create.request';

export type AdministratorCreateRequestDto = BaseProfileCreateDto & {
  graduation: string;
  salary: ApiSalaryRequest;
};
