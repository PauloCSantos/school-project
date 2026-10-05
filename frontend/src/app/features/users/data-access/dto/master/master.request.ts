import { MasterProfile } from '../../../../../domain/users/profile.type';

export type MasterProfileRequest = Omit<MasterProfile, 'birthday' | 'cnpj'> & {
  birthday: string;
};
