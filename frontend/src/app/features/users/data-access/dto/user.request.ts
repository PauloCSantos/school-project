import {
  AdministratorProfile,
  TeacherProfile,
  WorkerProfile,
  StudentProfile,
  MasterProfile,
} from '../../../../core/types/profile.type';

export type AnyProfile =
  | AdministratorProfile
  | TeacherProfile
  | WorkerProfile
  | StudentProfile
  | MasterProfile;

export type AnyProfileRequest = Omit<AnyProfile, 'birthday'> & { birthday: string };
