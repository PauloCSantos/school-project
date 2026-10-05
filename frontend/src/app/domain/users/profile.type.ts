// src/app/domain/users/profile.type.ts

export type Name = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type Address = {
  street: string;
  city: string;
  zip: string;
  number: number;
  avenue: string;
  state: string;
};

export type Salary = {
  salary: number;
  currency?: 'R$' | '€' | '$';
};

export type BaseProfile = {
  name: Name;
  address: Address;
  email: string;
  birthday: Date;
};

export type MasterProfile = BaseProfile & {
  cnpj: string;
};

export type AdministratorProfile = BaseProfile & {
  salary: Salary;
  graduation: string;
};

export type TeacherProfile = BaseProfile & {
  salary: Salary;
  graduation: string;
  academicDegrees: string;
};

export type StudentProfile = BaseProfile & {
  paymentYear: number;
};

export type WorkerProfile = BaseProfile & {
  salary: Salary;
};
