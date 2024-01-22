export interface FindNoteInputDto {
  id: string;
}
export interface FindNoteOutputDto {
  evaluation: string;
  student: string;
  note: number;
}

export interface FindAllNoteInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllNoteOutputDto {
  evaluation: string;
  student: string;
  note: number;
}
[];

export interface CreateNoteInputDto {
  id: string;
  evaluation: string;
  student: string;
  note: number;
}
export interface CreateNoteOutputDto {
  id: string;
}

export interface UpdateNoteInputDto {
  id: string;
  evaluation?: string;
  student?: string;
  note?: number;
}
export interface UpdateNoteOutputDto {
  evaluation: string;
  student: string;
  note: number;
}

export interface DeleteNoteInputDto {
  id: string;
}
export interface DeleteNoteOutputDto {
  message: string;
}
