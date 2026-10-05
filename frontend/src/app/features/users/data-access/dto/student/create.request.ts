import { BaseProfileCreateDto } from '../base/create.request';

export type StudentCreateRequestDto = BaseProfileCreateDto & {
  paymentYear: number;
};
