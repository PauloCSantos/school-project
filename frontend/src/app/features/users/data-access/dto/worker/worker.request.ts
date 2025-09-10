import { WorkerProfile } from '../../../../../core/types/profile.type';

export type WorkerProfileRequest = Omit<WorkerProfile, 'birthday'> & {
  birthday: string;
};
