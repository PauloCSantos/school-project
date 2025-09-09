import { StudentProfile } from '../../../core/types/profile.type';

export type StudentProfileRequest = Omit<StudentProfile, 'birthday'> & {
  birthday: string;
};
