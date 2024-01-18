import Note from '../domain/entity/note.entity';

export default interface NoteGateway {
  find(id: string): Promise<Omit<Note, 'id'> | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Omit<Note, 'id'>[]>;
  create(note: Note): Promise<string>;
  update(note: Note): Promise<Omit<Note, 'id'>>;
  delete(id: string): Promise<string>;
}
