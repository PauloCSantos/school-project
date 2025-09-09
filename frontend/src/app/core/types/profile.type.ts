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
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
  graduation: string;
};

export type TeacherProfile = BaseProfile & {
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
  graduation: string;
  academicDegrees: string;
};

export type StudentProfile = BaseProfile & {
  paymentYear: number;
};

export type WorkerProfile = BaseProfile & {
  salary: { salary: number; currency?: 'R$' | '€' | '$' };
};
