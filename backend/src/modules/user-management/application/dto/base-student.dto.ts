export interface IFindUserStudentInput {
  id: string;
}
export interface IFindUserStudentOutput {
  id: string;
  paymentYear: number;
}

export interface IFindAllUserStudentInput {
  quantity?: number;
  offset?: number;
}

export interface ICreateUserStudentInput {
  paymentYear: number;
}
export interface ICreateUserStudentOutput {
  id: string;
}

export interface IUpdateUserStudentInput {
  id: string;
  paymentYear?: number;
}
export interface IUpdateUserStudentOutput {
  id: string;
  paymentYear: number;
}

export interface IDeleteUserStudentInput {
  id: string;
}
export interface IDeleteUserStudentOutput {
  message: string;
}
