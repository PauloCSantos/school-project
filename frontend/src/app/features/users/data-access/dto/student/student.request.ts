import { StudentProfile } from '../../../../../domain/users/profile.type';

export type StudentProfileRequest = Omit<StudentProfile, 'birthday'> & {
  birthday: string;
};
