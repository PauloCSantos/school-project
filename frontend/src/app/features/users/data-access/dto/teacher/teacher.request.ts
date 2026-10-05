import { TeacherProfile } from '../../../../../domain/users/profile.type';

export type TeacherProfileRequest = Omit<TeacherProfile, 'birthday'> & {
  birthday: string;
};
