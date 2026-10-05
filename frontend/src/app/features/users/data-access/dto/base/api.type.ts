export type ApiNameRequest = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type ApiSalaryRequest = {
  salary: number;
  currency?: 'R$' | '€' | '$';
};

export type ApiAddressRequest = {
  street: string;
  city: string;
  zip: string;
  number: number;
  avenue: string;
  state: string;
};

export type ApiNameResponse = Readonly<{
  fullName: string;
  shortName: string;
}>;

export type ApiSalaryResponse = Readonly<{
  salary: string;
}>;

export type ApiAddressResponse = Readonly<{
  street: string;
  city: string;
  zip: string;
  number: number;
  avenue: string;
  state: string;
}>;
