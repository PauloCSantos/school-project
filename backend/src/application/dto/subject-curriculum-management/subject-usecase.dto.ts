export interface FindSubjectInputDto {
  id: string;
}
export interface FindSubjectOutputDto {
  name: string;
  description: string;
}

export interface FindAllSubjectInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllSubjectOutputDto
  extends Array<{
    name: string;
    description: string;
  }> {}

export interface CreateSubjectInputDto {
  name: string;
  description: string;
}
export interface CreateSubjectOutputDto {
  id: string;
}

export interface UpdateSubjectInputDto {
  id: string;
  name?: string;
  description?: string;
}
export interface UpdateSubjectOutputDto {
  name: string;
  description: string;
}

export interface DeleteSubjectInputDto {
  id: string;
}
export interface DeleteSubjectOutputDto {
  message: string;
}
