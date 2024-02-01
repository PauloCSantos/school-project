import NoteFacade from '@/application/facade/evaluation-note-attendance-management/facade/note.facade';
import CreateNote from '@/application/usecases/evaluation-note-attendance-management/note/createNote.usecase';
import DeleteNote from '@/application/usecases/evaluation-note-attendance-management/note/deleteNote.usecase';
import FindAllNote from '@/application/usecases/evaluation-note-attendance-management/note/findAllNote.usecase';
import FindNote from '@/application/usecases/evaluation-note-attendance-management/note/findNote.usecase';
import UpdateNote from '@/application/usecases/evaluation-note-attendance-management/note/updateNote.usecase';
import MemoryNoteRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/note.repository';

export default class NoteFacadeFactory {
  static create(): NoteFacade {
    const repository = new MemoryNoteRepository();
    const createNote = new CreateNote(repository);
    const deleteNote = new DeleteNote(repository);
    const findAllNote = new FindAllNote(repository);
    const findNote = new FindNote(repository);
    const updateNote = new UpdateNote(repository);
    const facade = new NoteFacade({
      createNote,
      deleteNote,
      findAllNote,
      findNote,
      updateNote,
    });

    return facade;
  }
}
