import {
  IFindNoteInput,
  IFindNoteOutput,
  IFindAllNoteInput,
  IFindAllNoteItemOutput,
  ICreateNoteInput,
  ICreateNoteOutput,
  IUpdateNoteInput,
  IUpdateNoteOutput,
  IDeleteNoteInput,
  IDeleteNoteOutput,
} from './base-note.dto';

export type FindNoteInputDto = IFindNoteInput;
export type FindNoteOutputDto = IFindNoteOutput;

export type FindAllNoteInputDto = IFindAllNoteInput;
export type FindAllNoteOutputDto = Array<IFindAllNoteItemOutput>;

export type CreateNoteInputDto = ICreateNoteInput;
export type CreateNoteOutputDto = ICreateNoteOutput;

export type UpdateNoteInputDto = IUpdateNoteInput;
export type UpdateNoteOutputDto = IUpdateNoteOutput;

export type DeleteNoteInputDto = IDeleteNoteInput;
export type DeleteNoteOutputDto = IDeleteNoteOutput;
