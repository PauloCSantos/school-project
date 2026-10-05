import { ApiSalaryRequest } from '../base/api.type';
import { BaseProfileCreateDto } from '../base/create.request';

export type TeacherCreateRequestDto = BaseProfileCreateDto & {
  graduation: string;
  academicDegrees: string;
  salary: ApiSalaryRequest;
};
