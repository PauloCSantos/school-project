import { ApiAddressResponse, ApiNameResponse } from './api.type';

export type BaseProfileListItemDto = Readonly<{
  id: string;
  name: ApiNameResponse;
  address: ApiAddressResponse;
  email: string;
  birthday: string;
}>;
