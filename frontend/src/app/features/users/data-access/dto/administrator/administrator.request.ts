import { AdministratorProfile } from '../../../../../domain/users/profile.type';

export type AdministratorProfileRequest = Omit<AdministratorProfile, 'birthday'> & {
  birthday: string;
};
