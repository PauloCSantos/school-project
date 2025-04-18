import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '../../gateway/note.gateway';

export default class MemoryNoteRepository implements NoteGateway {
  private _note: Note[];

  constructor(notes?: Note[]) {
    notes ? (this._note = notes) : (this._note = []);
  }

  async find(id: string): Promise<Note | undefined> {
    const note = this._note.find(note => note.id.value === id);
    if (note) {
      return note;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Note[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const notes = this._note.slice(offS, qtd);

    return notes;
  }
  async create(note: Note): Promise<string> {
    this._note.push(note);
    return note.id.value;
  }
  async update(note: Note): Promise<Note> {
    const noteIndex = this._note.findIndex(
      dbNote => dbNote.id.value === note.id.value
    );
    if (noteIndex !== -1) {
      return (this._note[noteIndex] = note);
    } else {
      throw new Error('Note not found');
    }
  }
  async delete(id: string): Promise<string> {
    const noteIndex = this._note.findIndex(dbNote => dbNote.id.value === id);
    if (noteIndex !== -1) {
      this._note.splice(noteIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Note not found');
    }
  }
}
