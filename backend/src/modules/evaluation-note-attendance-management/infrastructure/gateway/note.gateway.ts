import Note from '../../domain/entity/note.entity';

export default interface NoteGateway {
  find(id: string): Promise<Note | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Note[]>;
  create(note: Note): Promise<string>;
  update(note: Note): Promise<Note>;
  delete(id: string): Promise<string>;
}
