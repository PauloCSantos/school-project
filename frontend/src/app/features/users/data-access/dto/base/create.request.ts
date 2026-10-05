import { ApiAddressRequest, ApiNameRequest } from './api.type';

export type BaseProfileCreateDto = {
  name: ApiNameRequest;
  address: ApiAddressRequest;
  email: string;
  birthday: string;
};
