export interface IFindNoteInput {
  id: string;
}

export interface IFindNoteOutput {
  id: string;
  evaluation: string;
  student: string;
  note: number;
}

export interface IFindAllNoteInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllNoteItemOutput {
  id: string;
  evaluation: string;
  student: string;
  note: number;
}

export interface ICreateNoteInput {
  evaluation: string;
  student: string;
  note: number;
}

export interface ICreateNoteOutput {
  id: string;
}

export interface IUpdateNoteInput {
  id: string;
  evaluation?: string;
  student?: string;
  note?: number;
}

export interface IUpdateNoteOutput {
  id: string;
  evaluation: string;
  student: string;
  note: number;
}

export interface IDeleteNoteInput {
  id: string;
}

export interface IDeleteNoteOutput {
  message: string;
}
