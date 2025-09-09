import { MasterProfile } from '../../../core/types/profile.type';

export type MasterProfileRequest = Omit<MasterProfile, 'birthday'> & {
  birthday: string;
};
