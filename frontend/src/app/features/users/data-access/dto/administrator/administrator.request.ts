import { AdministratorProfile } from '../../../../../core/types/profile.type';

export type AdministratorProfileRequest = Omit<AdministratorProfile, 'birthday'> & {
  birthday: string;
};
