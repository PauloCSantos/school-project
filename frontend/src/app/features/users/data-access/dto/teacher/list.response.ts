import { ApiSalaryResponse } from '../base/api.type';
import { BaseProfileListItemDto } from '../base/list.response';

export type TeacherItemResponseDto = Readonly<
  BaseProfileListItemDto & {
    graduation: string;
    academicDegrees: string;
    salary: ApiSalaryResponse;
  }
>;

export type TeacherListResponseDto = ReadonlyArray<TeacherItemResponseDto>;
