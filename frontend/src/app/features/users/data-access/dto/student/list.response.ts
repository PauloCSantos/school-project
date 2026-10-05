import { BaseProfileListItemDto } from '../base/list.response';

export type StudentItemResponseDto = Readonly<
  BaseProfileListItemDto & {
    paymentYear: number;
  }
>;

export type StudentListResponseDto = ReadonlyArray<StudentItemResponseDto>;
