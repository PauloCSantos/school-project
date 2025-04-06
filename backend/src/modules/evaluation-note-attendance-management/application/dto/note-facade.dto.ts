export interface FindNoteInputDto {
  id: string;
}
export interface FindNoteOutputDto {
  id: string;
  evaluation: string;
  student: string;
  note: number;
}

export interface FindAllNoteInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllNoteOutputDto
  extends Array<{
    id: string;
    evaluation: string;
    student: string;
    note: number;
  }> {}

export interface CreateNoteInputDto {
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
  id: string;
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
