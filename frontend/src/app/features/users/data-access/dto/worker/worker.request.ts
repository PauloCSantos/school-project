import { WorkerProfile } from '../../../../../domain/users/profile.type';

export type WorkerProfileRequest = Omit<WorkerProfile, 'birthday'> & {
  birthday: string;
};
