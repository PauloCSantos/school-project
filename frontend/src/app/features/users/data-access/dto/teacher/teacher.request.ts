import { TeacherProfile } from '../../../../../core/types/profile.type';

export type TeacherProfileRequest = Omit<TeacherProfile, 'birthday'> & {
  birthday: string;
};
